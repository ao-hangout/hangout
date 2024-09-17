import { useEffect, useState } from 'react'
import Arweave from "arweave";
import * as WarpArBundles from 'warp-arbundles'
import { dryrun, message, spawn } from "@permaweb/aoconnect";
import { ARWEAVE_GATEWAY, MODULE, SCHEDULER } from "@/utils/consts";
import { isProcessOnChain } from "@/utils/aoutil";
import { PROFILE_LUA_CODE } from "@/utils/profile-lua-code";


// @ts-ignore
const pkg = WarpArBundles.default ? WarpArBundles.default : WarpArBundles
const { createData, ArweaveSigner } = pkg


// Areave Wallet
let arweave: Arweave;
let wallet: any;
let walletAddress: string;
let walletKey: string;
let profileID: string;


export function wait(ms: number | undefined) {
  return new Promise((r) => setTimeout(r, ms));
}


function checkWallet() {
  if (!arweave || !wallet) {
    return false;
  }
  else {
    return true;
  }
}



export function createDataItemSigner(wallet: any) {
  // @ts-ignore
  const signer = async ({ data, tags, target, anchor }) => {
    const signer = new ArweaveSigner(wallet)
    const dataItem = createData(data, signer, { tags, target, anchor })
    return dataItem.sign(signer)
      .then(async () => ({
        id: await dataItem.id,
        raw: await dataItem.getRaw()
      }))
  }

  return signer
}


export async function uploadCodeToProcess(process: any, data: string) {
  try {
    const messageId = await message({
      process,
      // @ts-ignore
      signer: createDataItemSigner(wallet),
      tags: [{ name: 'Action', value: 'Eval' }],
      data: data,
      anchor: ''
    });

    return messageId;
  } catch (error) {
    console.log("evaluate --> error:", error)
    return '';
  }
}

async function messageToAO(process: any, data: any, action: string) {
  try {
    const messageId = await message({
      process: process,
      // @ts-ignore
      signer: createDataItemSigner(wallet),
      tags: [{ name: 'Action', value: action }],
      data: JSON.stringify(data)
    });
    console.log('执行messageToAO')
    return messageId;
  } catch (error) {
    console.log("messageToAO -> error:", error)
    return '';
  }
}

export async function getDataFromAO(process: any, action: any, data?: any) {
  let result;
  try {
    result = await dryrun({
      process,
      data: JSON.stringify(data),
      tags: [{ name: 'Action', value: action }]
    });
  } catch (error) {
    console.log('getDataFromAO --> ERR:', error)
    return '';
  }

  const resp = result.Messages?.length > 0 ? result.Messages[0].Data : null;

  if (resp) {
    return JSON.parse(resp);
  } else {
    console.error("No messages received");
    return null;
  }
}


export function UploadToAoChain() {
  
  //ao wallet
  const [init, setInit] = useState(false);
  const [walletReady, setWalletReady] = useState(false);
  const [addressReady, setAddressReady] = useState(false);
  const [smartLoading, setSmartLoading] = useState(false);
  const [profileReady, setProfileReady] = useState(false);
  const [clickSave, setClickSave] = useState(false)



  //上传smart agent数据
  async function createAgent(xUsername: string, xName: string, xDes: string, xProfileImage: string, coverImage: string, instructions: string) {
    if (!checkWallet()) return;

    setSmartLoading(true);
    // setProfile('');
    // setUpdatedProfile('');
    setProfileReady(false);

    const process = await spawnProcess();
    console.log("spawn process --> ", process);

    // check the process if already on-chain (exist on Arweave)
    let check = true;
    let retryCount = 0;
    while (check) {
      await wait(2000);  // to check after 2 seconds
      const isOnChain = await isProcessOnChain(process);
      console.log("process isOnChain --> ", Boolean(isOnChain))

      if (isOnChain) {
        check = false;
      } else {
        console.log('Try again...');
        retryCount++;
        if (retryCount >= 100) {
          console.log('Process not found, please try again');
          return;
        }
      }
    }
    console.log("upload code to --> ", process);

    check = true;
    while (check) {
      await wait(2000);  // to upload after 2 seconds
      const upload = await uploadCodeToProcess(process, PROFILE_LUA_CODE);
      console.log("upload resp (msg id) --> ", upload);

      if (upload) {
        check = false;
      }
      else {
        console.log('Try uploading again...');
      }
    }

    const profile_data = {
      UserName: xUsername,
      DisplayName: xName,
      Description: xDes + ' - spawned by AO games.',
      ProfileImage: xProfileImage,
      CoverImage: coverImage,
      Instruction: instructions,
    }
    await wait(1000);
    console.log("profile_data --> ", profile_data);


    const create_profile = await messageToAO(process, profile_data, 'Update-Profile');
    if (create_profile) {
      // create profile success
      console.log("create profile success (profile id===process id) --> ", process);
      localStorage.setItem('messageId', create_profile)
      profileID = process;
      localStorage.setItem('aoProfileId', profileID)
      console.log('profileId', profileID)  
    } else {
      console.log('Profile/Process create failed. Try again.')
      return
    }
  }


  async function uploadFunc(xUsername: string, xName: string, xDes: string, xProfileImage: string, coverImage: string, instructions: string) {
    await initArweave()
    await createWallet()
    await createAgent(xUsername, xName, xDes, xProfileImage, coverImage, instructions)
  }


  async function spawnProcess() {
    try {
      const processId = await spawn({
        module: MODULE,
        scheduler: SCHEDULER,
        // @ts-ignore
        signer: createDataItemSigner(wallet),
        tags: [
          { name: 'Name', value: 'AO-Games-Profile' },
          { name: 'Description', value: 'Spawned by AO games' }
        ]
      });
  
      return processId;
    } catch (error) {
      console.log("spawnProcess --> error:", error)
      return '';
    }
  }


  async function initArweave() {
    arweave = await Arweave.init({});
    setInit(true);
    console.log("arweave --> ", arweave);
  }

  async function createWallet() {
    if (!arweave) {
      return;
    }

    wallet = await arweave.wallets.generate();
    setWalletReady(true);
    console.log("wallet --> ", wallet);
    localStorage.setItem('aoWallet', JSON.stringify(wallet))
  }


  //以创建agent方式的upload
  const createAOAgentUpload = async (xUsername: string, xName: string, xDes: string, xProfileImage: string, coverImage: string, instructions: string) => {
    console.log('开始调用createAOAgent')
    const result = await uploadFunc(xUsername, xName, xDes, xProfileImage, coverImage, instructions)
    return result
  }



  //查询上链agent的proflieId
  async function getAgent() {
    await initArweave()
    await createWallet()
    if (!checkWallet()) return;

    const ao_profile = await getDataFromAO(profileID, 'Query', 'Info');
    console.log("ao_profile --> ", ao_profile)
    // setProfile(JSON.stringify(ao_profile, null, '\t'));
  }


  //更新agent数据上链
  async function updateAgent(xUsername: string, xName: string, xDes: string, xProfileImage: string, coverImage: string, instructions: string, aoProfileId: string) {
    profileID = aoProfileId
    await initArweave()
    await createWallet()
    if (!checkWallet()) return;
    console.log('执行updateAgent')

    const profile_data = {
      UserName: xUsername,
      DisplayName: xName,
      Description: xDes + ' - spawned by AO games.',
      ProfileImage: xProfileImage,
      CoverImage: coverImage,
      Instruction: instructions
    }

    const update_profile = await messageToAO(profileID, profile_data, 'Update-Profile');
    if (update_profile) { //Update instruction Success
      console.log("Update instruction Success数据上链++++++++++update_profile --> ", update_profile);
    }
  }



  return { createAOAgentUpload, getAgent, updateAgent }
}

