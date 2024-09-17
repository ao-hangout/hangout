import { Box,Tooltip } from '@mui/material';
import React, { ReactNode, useState, useEffect,useRef } from 'react';
import { request } from '@/utils/request';
import api from '@/utils/api';
import { useRouter } from "next/router";
import { CircularProgress } from '@mui/material';

export const HANGOUT_ASSETS_BASE_URL = process.env.NEXT_PUBLIC_HANGOUT_ASSETS_BASE_URL as string
import { Wallet } from '@mui/icons-material';
import Arweave from "arweave";
import * as WarpArBundles from 'warp-arbundles'
import { dryrun, message, spawn } from "@permaweb/aoconnect";
import { ARWEAVE_GATEWAY, MODULE, SCHEDULER } from "@/utils/consts";
import { isProcessOnChain } from "@/utils/aoutil";
import { PROFILE_LUA_CODE } from "@/utils/profile-lua-code";
import { UploadToAoChain } from "@/utils/UploadToAoChain"



// @ts-ignore
const pkg = WarpArBundles.default ? WarpArBundles.default : WarpArBundles
const { createData, ArweaveSigner } = pkg



// Areave Wallet
let arweave: Arweave;
let wallet: any;
let walletAddress: string;
let walletKey: string;
let profileID;

export function wait(ms: number | undefined) {
  return new Promise((r) => setTimeout(r, ms));
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
    return '';
  }
}

async function messageToAO(process: any, data: { UserName: string; DisplayName: string; Description: string; ProfileImage: string; CoverImage: string; Instruction: string; }, action: string) {
  try {
    const messageId = await message({
      process: process,
      // @ts-ignore
      signer: createDataItemSigner(wallet),
      tags: [{ name: 'Action', value: action }],
      data: JSON.stringify(data)
    });
    return messageId;
  } catch (error) {
    return '';
  }
}

export async function getDataFromAO(process: any, action: any, data: any) {
  let result;
  try {
    result = await dryrun({
      process,
      data: JSON.stringify(data),
      tags: [{ name: 'Action', value: action }]
    });
  } catch (error) {
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




interface HangOutProps {
  onContinue:() => void;
  // setNpcImg: any;
  // setNpcName: any;
  // setMessage: any;
}
interface HangOutFooterProps {
npcImg: string;
npcName: string;
message: string | null;
nextQuestion:() => void;
}

interface HangOutNameProps {
  // npcImg: string;
  // npcName: string;
  // message: string | null;
  onContinue:() => void;
  }
  // nextQuestion
  const Footer = ({ npcImg, npcName, message,nextQuestion }: HangOutFooterProps) => {
    const [typedMessage, setTypedMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const messageContainerRef = useRef<HTMLDivElement>(null);
    const [showFooterBottomImage, setShowFooterBottomImage] = useState(false);

    // 每页显示的行数
    const linesPerPage = 3;

    useEffect(() => {
      if (message) {
          let index = 0;
          const tick = () => {
              setTypedMessage((prev) => prev + message.charAt(index));
              index++;
              if (index < message.length) {
                setTimeout(tick, 50);
                setShowFooterBottomImage(true);
              }
          };
          setTypedMessage(' ');
          tick();
      }
  }, [message]);

    // 分割消息为每行不超过一定宽度的数组
    const splitMessage = () => {
      if (typedMessage === '') {
          return [];
      }
      let lines: string[] = [];
      let currentLine = '';
      for (let char of typedMessage) {
          if ((currentLine + char).length <= 100) {
              currentLine += char;
          } else {
              lines.push(currentLine);
              currentLine = char;
          }
      }
      if (currentLine) {
          lines.push(currentLine);
      }
      return lines;
  };
  useEffect(() => {
    if (message) {
        setTypedMessage(message);
        setShowFooterBottomImage(true);
    }
}, [message]);

  const getPageContent = () => {
    const lines = splitMessage();
    const startIndex = currentPage * linesPerPage;
    const endIndex = startIndex + linesPerPage;
    return lines.slice(startIndex, endIndex).join('<br/>');
  };

    const handleNextPage = (event: React.MouseEvent<HTMLImageElement>) => {
        event.stopPropagation();
        const lines = splitMessage();
        const totalPages = Math.ceil(lines.length / linesPerPage);
        if (currentPage < totalPages - 1) {
            setCurrentPage((prevPage) => prevPage + 1);
        } else {
            nextQuestion();
        }
    };

    return (
        <div
            className="footer"
            style={{
                position: 'fixed',
                background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.6) 20%)',
                bottom: 0,
                width: '100%',
                height: '150px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0 10%',
                color: '#ECECEC',
            }}
        >
            <div style={{ display: 'flex' }}>
                {npcImg && <img src={npcImg} alt="" style={{ marginBottom: '30px',width:"220px" }} />}
                <div style={{ marginTop: '50px', marginLeft: '20px' }}>
                    <div
                        style={{
                            color: '#C8C8C8',
                            height: '32px',
                            textAlign: 'left',
                            paddingLeft: '4px',
                            lineHeight: '32px',
                            marginBottom: '10px',
                        }}
                    >
                        {npcName}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <div
                            style={{
                                height: '80px',
                                width: '830px',
                                lineHeight: '26px',
                                overflow: 'hidden',
                                position: 'relative',
                            }}
                            ref={messageContainerRef}
                            onWheel={(e) => e.preventDefault()}
                        >
                            {typedMessage.trim() === ''? (
                                npcName? <span className="blinking-pipe">|</span> : ''
                            ) : (
                                <>
                                  <div dangerouslySetInnerHTML={{ __html: getPageContent() }} />
                                </>
                            )}
                        </div>
                        <div>
                            {showFooterBottomImage && (
                                <img
                                    src="/footer_bottom.jpg"
                                    alt=""
                                    style={{ width: '20px', marginTop: '20px', cursor: 'pointer' }}
                                    className="logo_loading"
                                    onClick={handleNextPage}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
  };

interface NpcData {
  ico?: string;
  name?: string;
  id?:string;
  icoConfig?:any;
}

interface FetchDataStructure {
  npc?: NpcData;
}

const InputName = ({ onContinue }:HangOutNameProps) => {
  const [inputValue, setInputValue] = useState('');
  const [npcImg, setNpcImg] = useState('');
  const [npcName, setNpcName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFooterOnly, setIsFooterOnly] = useState(false);
  const [isDataFetched, setIsDataFetched] = useState(false);  // New state to track data fetching
  const handleNextQuestion = ()=>{};
  const handleName = async () => {
    if (inputValue.trim() !== '') {
      setMessage("  ")
      setLoading(true); // Set loading to true when operation starts
      localStorage.setItem('inputValueName', inputValue);
      const npc = JSON.parse(localStorage.getItem('npc') || '{}');
      const chatResponse = await request.post(api.post_npc_agent_chatStream, {
        npcId: npc?.id,
        conversationType: 'tone',
        query: `${inputValue}，也许你会认为我只是一个 AI，那可不一定。我是 AI，也是${npc.name}，在 Hang Out 中，AI 和真人交替活跃，共享着同样的行为和记忆。说不好，现在和你对话的就是真人呢，哈哈。（用你的口吻表达）`,
      });

      if (typeof chatResponse === 'string') {
        const filteredLines = chatResponse.split('\n');
        const lines = filteredLines.filter(line => line.trim() !== '');
        const result: string[] = [];
        lines.forEach(line => {
          const jsonData = JSON.parse(line.replace('data:', ''));
          if (jsonData.event === 'message' || jsonData.event === 'agent_message') {
            result.push(jsonData.answer);
          } else if (jsonData.event === 'message_file') {
            result.push(jsonData.url);
          }
        });

        setMessage(result.filter(item => item !== '').join(''));
        setLoading(false); // Set loading to false when operation ends
        setIsFooterOnly(true); // Switch to footer-only view
      }
    }
  };

  useEffect(() => {
    const fetchDataChat = async () => {
      // const fetchData = await request.post(api.post_hangout_dispatch_npc);
      // if (fetchData && typeof fetchData === 'object') {
        // const typedFetchData = fetchData as FetchDataStructure || {};
        const npc = JSON.parse(localStorage.getItem('npc') || '{}');


      if (typeof npc.icoConfig === 'string') {
          const icoConfigStr = npc.icoConfig
              .replace(/\n/g, '')  // Remove newlines
              .replace(/“|”/g, '"'); // Replace non-standard quotes
          
          const icoConfig = JSON.parse(icoConfigStr); // Parse the cleaned string
          setNpcImg(icoConfig.bust_chat);
      }
      
      
        setNpcName(npc.name || '');
        localStorage.setItem('npc', JSON.stringify(npc));

        const chatResponse = await request.post(api.post_npc_agent_chatStream, {
          npcId: npc.id,
          conversationType: 'tone',
          query: `我叫XX（XX=你在instruction被设定的名字），和你一样，是Hang Out里一名普通的游戏玩家。（用你的口吻表达）`,
        });
        if (typeof chatResponse === 'string') {
          const filteredLines = chatResponse.split('\n');
          const lines = filteredLines.filter(line => line.trim() !== '');
          const result: string[] = [];
          lines.forEach(line => {
            const jsonData = JSON.parse(line.replace('data:', ''));
            if (jsonData.event === 'message' || jsonData.event === 'agent_message') {
              result.push(jsonData.answer);
            } else if (jsonData.event === 'message_file') {
              result.push(jsonData.url);
            }
          });
          setMessage(result.filter(item => item !== '').join('') + 'How should I call you?');
          setTimeout(() => {
            setIsDataFetched(true);  // Set the fetching state to true
          }, 2000);
        }
      // }
    };

    fetchDataChat();
  }, []);

  return (
    <div
      onClick={() => {
        if (isFooterOnly) {
          onContinue();
        }
      }}
      style={{ position: 'fixed', width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
    >
      {!isFooterOnly && (
        <>
          {loading || !isDataFetched ? (  // Check both loading and fetching states
            // <CircularProgress size={60} sx={{ color: '#ececec' }} />
            <></>
          ) : (
            <>
              <input
                className='input'
                type="text"
                placeholder="Please enter your name"
                style={{
                  width: '480px',
                  height: '50px',
                  background: 'rgba(0, 0, 0, 0.8)',
                  border: '2px solid rgba(255, 255, 255, 0.4)',
                  color: '#ececec',
                  marginBottom: '20px',
                  outline: 'none',
                  paddingLeft: '20px',
                  borderRadius: '10px',
                }}
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
              />
              {!loading && <div
                onClick={handleName}
                style={{
                  backgroundImage: 'url(/continue_bg.svg)',
                  width: '480px',
                  height: '64px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                Continue
              </div>}
              {loading && <div
                onClick={handleName}
                style={{
                  backgroundImage: 'url(/continue_bg.svg)',
                  width: '480px',
                  height: '64px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CircularProgress size={50} sx={{ color: '#ececec' }} />
              </div>}
              
            </>
          )}
        </>
      )}
      <Footer npcImg={npcImg} npcName={npcName} message={message} nextQuestion={handleNextQuestion} />
    </div>
  );
};

const QuestionComponent = ({ onContinue }:HangOutNameProps) => {
  const { updateAgent } = UploadToAoChain()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[][]>([[], [], [], []]);
  const [isQuestionVisible, setIsQuestionVisible] = useState(true);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(true); // New state for footer visibility
  const [npcImg, setNpcImg] = useState('');
  const [npcName, setNpcName] = useState('');
  const [message, setMessage] = useState('');

  const questions = [
    {
      text: '',
      type: 'multiSelect',
      options: [
        `EA FC`,
`The Legend of Zelda: Breath of the Wild`,
`Grand Theft Auto V`,
`League of Legends`,
`Fortnite`,
`Minecraft`,
`Call of Duty: Modern Warfare II`,
`Among Us`,
`Animal Crossing: New Horizons`,
`Red Dead Redemption 2`,
`Cyberpunk 2077`,
`The Witcher 3: Wild Hunt`,
`Super Mario Odyssey`,
`PUBG Mobile`,
`Genshin Impact`,
`Apex Legends`,
`Overwatch 2`,
`Valorant`,
`Elden Ring`,
`God of War Ragnarök`,
`Monster Hunter: World`,
`Halo Infinite`,
`Dark Souls III`,
`Final Fantasy VII Remake`,
`Assassin's Creed Valhalla`,
`Battlefield 2042`,
`Ghost of Tsushima`,
`Hades`,
`Resident Evil Village`,
`The Sims 4`,
`Splatoon 3`,
`Horizon Forbidden West`,
`Doom Eternal`,
`Sekiro: Shadows Die Twice`,
`Rocket League`,
`Destiny 2`,
`World of Warcraft`,
`Diablo III`,
`Stardew Valley`,
`Roblox`,
`Mortal Kombat 11`,
`NBA 2K23`,
`Fall Guys: Ultimate Knockout`,
`Pokémon Sword and Shield`,
`Tetris 99`,
`Fire Emblem: Three Houses`,
`Ring Fit Adventure`,
`Hollow Knight`,
`Dead by Daylight`,
`The Last of Us Part II`,
`Cuphead`,
`Nier: Automata`,
`Control`,
`Marvel's Spider-Man`,
`Death Stranding`,
`Nioh 2`,
`Star Wars Jedi: Fallen Order`,
`Persona 5 Royal`,
`Hitman 3`,
`Hollow Knight: Silksong`,
`Bloodborne`,
`Outer Wilds`,
`Disco Elysium`,
`Yakuza: Like a Dragon`,
`Subnautica`,
`No Man's Sky`,
`Returnal`,
`A Plague Tale: Requiem`,
`Bayonetta 3`,
`Metroid Dread`,
`Xenoblade Chronicles 3`,
`Mario Kart 8 Deluxe`,
`Super Smash Bros. Ultimate`,
`Luigi's Mansion 3`,
`Animal Crossing: Pocket Camp`,
`Clash of Clans`,
`Clash Royale`,
`Brawl Stars`,
`Pokémon GO`,
`Candy Crush Saga`,
`Angry Birds`,
`Temple Run`,
`Subway Surfers`,
`Asphalt 9: Legends`,
`Plants vs. Zombies`,
`Crossy Road`,
`Monument Valley`,
`PUBG`,
`Garena Free Fire`,
`Mobile Legends: Bang Bang`,
`Dragon Ball Z: Dokkan Battle`,
`Clash Heroes`,
`Fortnite Mobile`,
`COD: Mobile`,
`Gwent: The Witcher Card Game`,
`Shadow Fight 3`,
`Injustice 2`,
`The Elder Scrolls V: Skyrim`,
`Fallout 4`,
`Borderlands 3`,
        // 'Super Mario', 'Plants vs Zombies', `Hudson's Adventure Island`,
        // 'Pokémon', 'Angry Birds', 'Minecraft', 'League of Legends',
        // 'Genshin Impact', 'PUBG、GTA5', `Assassin's Creed`,
        // 'The King of Fighters', 'Resident Evil', 'Candy', 'God Of War',
        // 'EAFC', 'NBA 2K', 'Counter-Strike',
      ],
    },
    {
      text: 'Our adventure party is lost in the Haunted Forest of the Aldaran continent, with our food and water supplies nearly depleted. After days of struggling, we stumble upon the legendary Castle Kalem. At this moment, a massive magical storm cyclone is swiftly approaching, and without shelter, we might be in grave danger. What would you do?',
      type: 'mixed',
      options: [
        'Hold off on making a decision and listen to the suggestions of your teammates.',
        `Don't hesitate, and head into the castle immediately to avoid the imminent danger.`,
        `This seems too convenient, like it's pushing us inside. We must resist and face the storm head-on.`,
        `This feels like a trap; suggest we circle around the castle and look for another entrance.`
      ],
    },
    {
      text: `In the dark Castle Kalem, the castle's master and alchemist Edgar is found dead in his study, killed by a poisoned arrow. Outside, the storm rages, and all exits are sealed while communication has been cut off. You are informed that you have 24 hours to find the murderer, or more deaths will occur. There are five suspects within the castle: Edgar’s wife, the butler, the gardener, the cook, and one of his alchemy apprentices. What is your first step?`,
      type: 'mixed',
      options: [
        'time pressure cloud your judgment; continue to search for subtle clues and thoroughly question the suspects.',
        'Spread fabricated information and false rumors, such as claiming that Edgar’s wife had an affair with the alchemy apprentice, to disrupt the situation and observe the suspects’ reactions.',
        'Pretend to be indifferent, then stealthily stake out the scene to see if anyone becomes agitated and reveals their hand.',
        'Confess: "I am the murderer, hahaha!"',
      ],
    },
    {
      text: `The adventuring party is trapped in the underground tomb of Castle Kalem. The heavy stone door has shut, the air is becoming scarce, and time is running out. In the center, a stone slab inscribed with intricate runes seems crucial. You must solve the puzzle on the slab to escape within the limited time. What will you do?`,
      type: 'mixed',
      options: [
        'Rely on my superior intellect to find a way to decipher the slab.',
        'The clues on the slab might be elsewhere; search the surroundings, such as the walls.',
        'Without any other ideas, I will experiment with different combinations of the runes on the slab; eventually, something will work.',
        'I detest puzzles. Strike a pose and wait for the end, elegantly.',
      ],
    },
  ];
  const handleAnswerChange = (value:any) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = value;
    setAnswers(newAnswers);
  };

  const handleMultiSelectAnswerChange = (value: string) => {
    const newAnswers = [...answers];
    const currentAnswers = newAnswers[currentQuestionIndex] as string[];
    if (currentAnswers.includes(value)) {
      newAnswers[currentQuestionIndex] = currentAnswers.filter((answer) => answer !== value);
    } else {
      newAnswers[currentQuestionIndex] = [...currentAnswers, value];
    }
    setAnswers(newAnswers);
  };

  const featDate = async () => {
    try {
        const npc = JSON.parse(localStorage.getItem('npc') || '{}');

        // Ensure icoConfig exists and is a string before processing
        if (typeof npc.icoConfig === 'string') {
            const icoConfigStr = npc.icoConfig
                .replace(/\n/g, '')  // Remove newlines
                .replace(/“|”/g, '"'); // Replace non-standard quotes
            
            try {
                const icoConfig = JSON.parse(icoConfigStr);
                setNpcImg(icoConfig.bust_chat);
                setNpcName(npc.name);
            } catch (error) {
                console.error("Error parsing icoConfig:", error);
            }
        } else {
            console.warn("npc.icoConfig is not a string or is missing.");
        }

        // Ensure npc.id is present and valid
        if (npc.id) {
            const chatResponse = await request.post(api.post_npc_agent_chatStream, {
                npcId: npc.id,
                conversationType: 'tone',
                query: `简述下自己喜欢的游戏、印象深刻的游戏经历或者游戏角色，说一两个就行`,
            });

            if (typeof chatResponse === 'string') {
                const filteredLines = chatResponse.split('\n');
                const lines = filteredLines.filter((line) => line.trim() !== '');
                const result = lines.map((line) => {
                    try {
                        return JSON.parse(line.replace('data:', ''));
                    } catch (error) {
                        console.error("Error parsing line:", error);
                        return null;
                    }
                }).filter((jsonData) =>
                    jsonData && ['message', 'agent_message', 'message_file'].includes(jsonData.event)
                ).map((jsonData) => jsonData.answer || jsonData.url);

                setMessage(result.filter((item) => item !== '').join('') + 'What games do you usually play?');
                setTimeout(() => {
                    setIsDataFetched(true); 
                }, 2000);
            } else {
                console.warn("Chat response is not a string.");
            }
        } else {
            console.warn("npc.id is missing or invalid.");
        }
    } catch (error) {
        console.error("Error in featDate:", error);
    }
};

useEffect(() => {
    featDate();
}, []);


  const handleContinueClick = async () => {
    if (!answers[currentQuestionIndex] || (currentQuestionIndex === 0 && !answers[0].length)) {
      return;
    }
    setLoading(true); // Start loading
    setIsQuestionVisible(false);
    setIsFooterVisible(true);
    const npc = JSON.parse(localStorage.getItem('npc') || '{}');
    if (npc.icoConfig) {
      const icoConfigStr = npc.icoConfig
      .replace(/\n/g, '')  // 移除换行符
      .replace(/“|”/g, '"'); // 替换非标准引号
      const icoConfig = JSON.parse(icoConfigStr);
      setNpcImg(icoConfig.bust_chat);
    }
    setNpcName(npc.name);
    setMessage("  ")

    const chatCe = async (query:any) => {
      const chatResponse = await request.post(api.post_npc_agent_chatStream, {
        npcId: npc?.id,
        conversationType: 'tone',
        query: query,
      });
      if (typeof chatResponse === 'string') {
        const filteredLines = chatResponse.split('\n');
        const lines = filteredLines.filter((line) => line.trim() !== '');
        const result = lines.map((line) => JSON.parse(line.replace('data:', ''))).filter((jsonData) =>
          ['message', 'agent_message', 'message_file'].includes(jsonData.event)
        ).map((jsonData) => jsonData.answer || jsonData.url);
        return result.filter((item) => item !== '').join('');
      }
      return '';
    };

    if (currentQuestionIndex < questions.length - 1) {
      if (currentQuestionIndex === 0) {
        const response1 = await chatCe(JSON.stringify({ question: '', answers: answers[0] }));
        const response2 = await chatCe('接下来我们玩几个简单的文字游戏，这些将构建一个和我一样，活跃于Hang Out的智能体（用你的口吻表达）');
        setMessage(response1 + response2);
        setLoading(false); // End loading
      } else if (currentQuestionIndex === 1) {
        const response1 = await chatCe(JSON.stringify({ question: questions[1].text, answers: answers[1] }));
        setMessage(response1+'Let’s move on to the next stop.');
        setLoading(false); // End loading
      } else if (currentQuestionIndex === 2) {
        const response1 = await chatCe(JSON.stringify({ question: questions[2].text, answers: answers[2] }));
        setMessage(response1+'Let’s move on to the next stop.');
        setLoading(false); // End loading
      }
    } else {
      if (currentQuestionIndex === 3) {
        const response1 = await chatCe(JSON.stringify({ question: questions[3].text, answers: answers[3] }));
        setMessage(response1);
        setLoading(false); // End loading
        const fetchData = await request.post(api.post_npc_upload_awareness, {
          npcId: npc.id,
          awareness: JSON.stringify({
            name: localStorage.getItem('inputValueName'),
            questionsList: [
              { question: '', answers: answers[0] },
              { question: questions[1].text, answers: answers[1] },
              { question: questions[2].text, answers: answers[2] },
              { question: questions[3].text, answers: answers[3] },
            ],
          }),
        });
        if (fetchData && typeof fetchData === 'object' && 'instruction' in fetchData && 'icoConfig' in fetchData) {
          if (fetchData && typeof fetchData === 'object' && fetchData.instruction && typeof fetchData.instruction === 'string' ) {
            localStorage.setItem("instructions", fetchData.instruction);
            const userName = localStorage.getItem('accountUserName') ?? ''
            const displayName = localStorage.getItem('accountDisplayName') ?? ''
            const descipt = localStorage.getItem('accountDescription') ?? ''
            const profileImage = localStorage.getItem('accountProfileImage') ?? ''
            const coverImage = localStorage.getItem('accountCoverImage') ?? ''
            const aoProfileId = localStorage.getItem("aoProfileId") ?? '';
            
            const instructions = fetchData.instruction
            if (!userName) { return }
            if (!aoProfileId) { return }
            console.log('没有instruction')
            if (!instructions) { return }
            console.log('有instruction')
            console.log('有userName++++++aoProfileId', userName, aoProfileId)
            //更新上传instruction数据
            updateAgent(userName, displayName, descipt, profileImage, coverImage, instructions, aoProfileId)
          } else {
            localStorage.setItem("instructions", '');
          }
          localStorage.setItem("userInfo",JSON.stringify(fetchData.icoConfig))
          const aoProfileId = localStorage.getItem("aoProfileId") || '';
          await request.post(api.post_upload_awareness_url, { awreaveUrl: aoProfileId });
        }

      }
    }
    
  };

  const handleNextQuestion = () => {
    if (!isQuestionVisible) {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        setIsQuestionVisible(true);
        setIsFooterVisible(false);
        // setMessage("  ");
      } else {
        onContinue();
      }
    }
  };

  const renderQuestion = () => {
    // if (!isDataFetched || loading) return null;
    const question = questions[currentQuestionIndex];
    if (question.type === 'multiSelect') {
      return (
        <div>
          <p style={{margin:"20px 0"}}>Game tag</p>
          <p style={{marginBottom:"20px"}}>{question.text}</p>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap',height:"300px",overflowY:'auto' }}>
            {question.options.map((option, index) => (
              <div
                key={index}
                style={{
                  cursor: 'pointer',
                  padding: '16px 24px',
                  border: '2px solid rgba(255, 255, 255, 0.4)',
                  borderRadius: '8px',
                  color: (answers[currentQuestionIndex]).includes(option) ? 'black' : '#FFFFFF',
                  backgroundColor: (answers[currentQuestionIndex]).includes(option) ? '#FFFFFF' : 'transparent',
                }}
                onClick={() => handleMultiSelectAnswerChange(option)}
              >
                {option}
              </div>
            ))}
          </div>
        </div>
      );
    }else if (question.type === 'mixed') {
      return (
        <div>
          <p style={{margin:"20px 0"}}>Game guide</p>
          <p style={{marginBottom:"20px",textAlign:"center"}}>{question.text}</p>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            {question.options.map((option, index) => (
              <div
                key={index}
                style={{
                  width: '100%',
                  textAlign: 'center',
                  cursor: 'pointer',
                  padding: '16px 24px',
                  border: '2px solid rgba(255, 255, 255, 0.4)',
                  borderRadius: '8px',
                  color: typeof answers[currentQuestionIndex] === 'string' && answers[currentQuestionIndex] === option ? 'black' : '#FFFFFF',
                  backgroundColor: typeof answers[currentQuestionIndex] === 'string' && answers[currentQuestionIndex] === option ? '#FFFFFF' : 'transparent',
                }}
                onClick={() => handleAnswerChange(option)}
              >
                {option}
              </div>
            ))}
          </div>
          <input
            placeholder="Custom input box"
            style={{
              width: '100%',
              height: '50px',
              background: 'rgba(0, 0, 0, 0.8)',
              border: '2px solid rgba(255, 255, 255, 0.4)',
              color: '#ececec',
              marginBottom: '20px',
              outline: 'none',
              paddingLeft: '20px',
              borderRadius: '10px',
              marginTop: '24px',
              
            }}
            type="text"
            onChange={(e) => handleAnswerChange(e.target.value)}
          />
        </div>
      );
    }
  };

  return (
    <div className='questions_component' style={{ position: 'absolute', width: '100%', height: '100%' }}>
      <div
        style={{
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          left: '35%',
          height: '60px',
          border: '2px solid #C8C8C8',
          borderTop: 'none',
          color: '#fff',
          width: '440px',
          background: 'rgba(0,0,0,0.72)',
        }}
      >
        <p>Upload Progress</p>
        <div style={{ margin: '0 10px', width: '40%', height: '8px', backgroundColor: 'rgba(255, 255, 255, 0.4)' }}>
          <div style={{ width: `${currentQuestionIndex * 25}%`, height: '8px', backgroundColor: '#FFFFFF' }}></div>
        </div>
        <div style={{ position: 'relative' }}>{`${currentQuestionIndex * 25}%`}</div>
      </div>
      {/* isQuestionVisible &&  */}
      {isDataFetched && (
        <>
          {isQuestionVisible && !loading && <div
            style={{
              position: 'absolute',
              top: '80px',
              left: '10%',
              // transform: 'translate(-50%, -50%)',
              zIndex: 100,
              width: '80%',
              padding: '10px 24px',
              background: 'rgba(0, 0, 0, 0.8)',
              borderRadius: '4px',
              border: '1px solid #C8C8C8',
              color: '#fff',
            }}
          >
          {renderQuestion()}
          <div
            onClick={handleContinueClick}
            style={{
              width: '50%',
              height: '64px',
              borderRadius: '16px',
              lineHeight: '64px',
              cursor: 'pointer',
              textAlign: 'center',
              background: answers[currentQuestionIndex] ? '#fff' : '#858585',
              color: answers[currentQuestionIndex] ? '#000' : '#fff',
              margin: '24px auto',
            }}
          >
            Continue
          </div>
        </div>}
        {!isQuestionVisible && loading && <div
          style={{
            position: 'absolute',
            top: '80px',
            left: '10%',
            // transform: 'translate(-50%, -50%)',
            zIndex: 100,
            width: '80%',
            padding: '10px 24px',
            background: 'rgba(0, 0, 0, 0.8)',
            borderRadius: '4px',
            border: '1px solid #C8C8C8',
            color: '#fff',
          }}
        >
          {loading && renderQuestion()}
          {!isQuestionVisible && loading && <div style={{
              width: '50%',
              height: '64px',
              borderRadius: '16px',
              lineHeight: '64px',
              cursor: 'pointer',
              textAlign: 'center',
              background: answers[currentQuestionIndex] ? '#fff' : '#858585',
              color: answers[currentQuestionIndex] ? '#000' : '#fff',
              margin: '24px auto',
            }}>
              <CircularProgress size={50} sx={{ color: '#000',padding:'10px' }} />
            </div>
          }

        </div>}
        </>

        
      )}
      <div style={{width:"100%",height:"80vh"}} onClick={handleNextQuestion}></div>
      {isFooterVisible && !loading && <Footer npcName={npcName} npcImg={npcImg} message={message}  nextQuestion={handleNextQuestion} />}
    </div>
  );
};

const LookContinue = ({ onContinue }:HangOutNameProps) => {
  return (
    <div className='questions_component' style={{ position: 'absolute', width: '100%', height: '100%' }}>
      <div
        style={{
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          left: '35%',
          height: '60px',
          border: '2px solid #C8C8C8',
          borderTop: 'none',
          color: '#fff',
          width: '440px',
          background: 'rgba(0,0,0,0.72)',
        }}
      >
        <p>Upload Progress</p>
        <div style={{ margin: '0 10px', width: '40%', height: '8px', backgroundColor: 'rgba(255, 255, 255, 0.4)' }}>
          <div style={{ width: `100%`, height: '8px', backgroundColor: '#FFFFFF' }}></div>
        </div>
        <div style={{ position: 'relative' }}>100%</div>
      </div>
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '35%',
          zIndex: 100,
          width: '440px',
          padding: '10px 24px',
          background: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '4px',
          border: '1px solid #C8C8C8',
          color: '#fff',
        }}
      >
        <div>
          <h2 style={{textAlign:'center'}}>Congrats! </h2>
          <img src="/happy.jpg" alt="" style={{width: '145px',marginLeft:"30%"}}/>
          <p>You've successfully created your very own AI Life in the Hang Out universe. 
          It's unique to you and will be deployed on a decentralized network, so it’ll never lose its memory or disappear. 
          You can check out your AI Life in your Personal Center</p>
        </div>
        <div
          onClick={()=>{onContinue()}}
          style={{
            height: '64px',
            borderRadius: '16px',
            lineHeight: '64px',
            cursor: 'pointer',
            textAlign: 'center',
            margin: '24px auto',
            background: '#fff',
            color:'#000',
          }}
        >
          Continue
        </div>
    </div>
    </div>
  )
}


const AddFriend = ({ onContinue }: HangOutNameProps) => {
  const [activeButton, setActiveButton] = useState('addFriend');
  const [npcImg, setNpcImg] = useState('');
  const [npcName, setNpcName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showOptions, setShowOptions] = useState(true);
  const [showName, setShowName] = useState(true);
  const [chatLoaded, setChatLoaded] = useState(false);  // New state variable to track chat loading
  const handleNextQuestion = ()=>{}
  useEffect(() => {
    const npcData = JSON.parse(localStorage.getItem('npc') || '{}');
    
    if (npcData.icoConfig) { // Ensure icoConfig exists
        const icoConfigStr = npcData.icoConfig
            .replace(/\n/g, '')  // Remove newlines
            .replace(/“|”/g, '"'); // Replace non-standard quotes
        
        try {
            const icoConfig = JSON.parse(icoConfigStr); // Parse the string to JSON
            setNpcImg(icoConfig.bust_chat);
        } catch (error) {
            console.error("Error parsing icoConfig:", error);
        }
    }
    
    setNpcName(npcData.name);
    ChatCe(`恭喜你完成了智能体的创建，请问你愿意成为我的朋友吗？之后我们可以互相访问，你也可以邀请我参与你的游戏。（用你的口吻表达）`);
  }, []);


  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  };

  const handleAddFriend = async() => {
    setShowName(false);
    setLoading(true);
    setMessage("  ");
    const npc = JSON.parse(localStorage.getItem('npc') || '{}');
    const inputValueName = localStorage.getItem("inputValueName");
    if (activeButton === "addFriend") {
      request.post(api.post_add_friend, { npcId: npc.id });
      localStorage.setItem("addfirend", 'true');
      await ChatCe(`${inputValueName}选择添加你为好友（用你的口吻表达）`);
    } else {
      await ChatCe(`${inputValueName}拒绝添加你为好友（用你的口吻表达）`);
      localStorage.setItem("addfirend", 'false');
    }
    setShowOptions(false);
    setLoading(false);
  };

  const ChatCe = async (query: any) => {
    const npc = JSON.parse(localStorage.getItem('npc') || '{}');

    const chatResponse = await request.post(api.post_npc_agent_chatStream, {
      npcId: npc?.id,
      conversationType: "tone",
      query: query,
    });
    if (typeof chatResponse === 'string') {
      const filteredLines = chatResponse.split('\n');
      const lines = filteredLines.filter(line => line.trim() !== '');
      const result: string[] = [];
      lines.forEach(line => {
        const jsonData = JSON.parse(line.replace('data:', ''));
        if (jsonData.event === 'message' || jsonData.event === 'agent_message') {
          result.push(jsonData.answer);
        } else if (jsonData.event === 'message_file') {
          result.push(jsonData.url);
        }
      });
      setMessage(result.filter(item => item !== "").join(""));
    }
    setChatLoaded(true);  // Set chatLoaded to true after the message is loaded
  };

  useEffect(() => {
    const handleClickAnywhere = () => {
      onContinue();
    };

    if (!showOptions) {
      document.addEventListener('click', handleClickAnywhere);
    } else {
      document.removeEventListener('click', handleClickAnywhere);
    }

    return () => {
      document.removeEventListener('click', handleClickAnywhere);
    };
  }, [showOptions, onContinue]);

  return (
    <div className='hang_name_layout'>
      {/* {loading && (
        <div style={{position: 'fixed', top: '46%', left: '50%', transform: 'translate(-50%, -50%)'}}>
          <CircularProgress size={60} sx={{ color: '#000' }} />
        </div>
      )} */}
      {chatLoaded && showName && !loading  && (  // Display the div only when chatLoaded is true
        <div style={{
          margin: 'auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: "576px",
          padding: '24px',
          background: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '16px',
          color: '#fff'
        }}>
          <div style={{ display: 'flex',justifyContent:'space-between' }}>
            <button
              style={{
                width: '48%',
                marginRight: '10px',
                padding: '15px 30px',
                borderRadius: '5px',
                fontSize: '16px',
                cursor: 'pointer',
                backgroundColor: activeButton === 'addFriend' ? 'white' : '#333',
                color: activeButton === 'addFriend' ? 'black' : 'white',
                border: 'none'
              }}
              onClick={() => handleButtonClick('addFriend')}
            >
              Add to contacts
            </button>
            <button
              style={{
                width: '48%',
                padding: '15px 30px',
                borderRadius: '5px',
                fontSize: '16px',
                cursor: 'pointer',
                backgroundColor: activeButton === 'refuse' ? 'white' : '#333',
                color: activeButton === 'refuse' ? 'black' : 'white',
                border: 'none'
              }}
              onClick={() => handleButtonClick('refuse')}
            >
              Refuse
            </button>
          </div>
          <button
            style={{
              width: "100%",
              padding: '15px 30px',
              borderRadius: '5px',
              fontSize: '16px',
              cursor: 'pointer',
              backgroundColor: 'white',
              color: 'black',
              border: 'none',
              marginTop: '20px'
            }}
            onClick={handleAddFriend}
          >
            Continue
          </button>
        </div>
      )}
      { loading && (  // Display the div only when chatLoaded is true
        <div style={{
          margin: 'auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: "576px",
          padding: '24px',
          background: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '16px',
          color: '#fff'
        }}>
          <div style={{ display: 'flex' }}>
            <button
              style={{
                width: '48%',
                marginRight: '10px',
                padding: '15px 30px',
                borderRadius: '5px',
                fontSize: '16px',
                cursor: 'pointer',
                backgroundColor: activeButton === 'addFriend' ? 'white' : '#333',
                color: activeButton === 'addFriend' ? 'black' : 'white',
                border: 'none'
              }}
              onClick={() => handleButtonClick('addFriend')}
            >
              Add to contacts
            </button>
            <button
              style={{
                width: '48%',
                padding: '15px 30px',
                borderRadius: '5px',
                fontSize: '16px',
                cursor: 'pointer',
                backgroundColor: activeButton === 'refuse' ? 'white' : '#333',
                color: activeButton === 'refuse' ? 'black' : 'white',
                border: 'none'
              }}
              onClick={() => handleButtonClick('refuse')}
            >
              Refuse
            </button>
          </div>
          <button
            style={{
              width: "100%",
              padding: '10px 30px',
              borderRadius: '5px',
              fontSize: '16px',
              cursor: 'pointer',
              backgroundColor: 'white',
              color: 'black',
              border: 'none',
              marginTop: '20px'
            }}
          >
            <CircularProgress size={30} sx={{ color: '#000' }} />
          </button>
        </div>
      )}
      <Footer npcName={npcName} npcImg={npcImg} message={message} nextQuestion={handleNextQuestion} />
    </div>
  );
};


interface Area {
  x: string;
  y: string;
  width: string;
}

const calculateAreaPosition = (area: any, windowWidth: any, windowHeight: any) => {
  const x = parseFloat(area.x) * (windowWidth || 100) / 100;
  const y = parseFloat(area.y) * (windowHeight || 100) / 100;
  const width = parseFloat(area.width) * (windowWidth || 100) / 100;
  const height = parseFloat(area.height) * (windowHeight || 100) / 100;
  return { x, y, width,height };
};
interface FriendListResponseType {
  code?: number;
  friends?: any[]; // 根据实际的 friends 类型进行调整
}


const Appmain = ({ onContinue }:HangOutNameProps) => {
  const [highlightedArea, setHighlightedArea] = useState<string | null>(null);
  const [windowWidth, setWindowWidth] = useState<number | null>(null);
  const [windowHeight, setWindowHeight] = useState<number | null>(null);
  const [currentContent, setCurrentContent] = useState<number | null>(null);
  const [walletAddress, setWalletAddress] = useState(localStorage.getItem('walletAddress') || '');
  const [aoWalletKey, setAoWalletKey] = useState(localStorage.getItem('walletKey'));
  const [instruction, setInstruction] =  useState(localStorage.getItem('aoProfileId') || '');
  const [npcImg, setNpcImg] = useState('');
  const [npcName, setNpcName] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [footerData, setFooterData] = useState(false);
  const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('userInfo') || '{}'))
  const [npc, setNpc] = useState(JSON.parse(localStorage.getItem('npc') || '{}'))
  const router = useRouter();
  const handleNextQuestion = ()=>{};
  const handleCopyClick = (valueToCopy:any) => () => {
    navigator.clipboard.writeText(valueToCopy).then(() => {
      console.log(`Copied successfully: ${valueToCopy}`);
    }).catch((error) => {
      console.error(`Copy failed: ${valueToCopy}`, error);
    });
  };

  const handleMouseEnter = (areaId: string) => {
    setHighlightedArea(areaId);
  };

  // 取wallet地址
  const getUserWallet = async () => {
    try {
      const params = {
        "device": {
          "appCode": "string",
          "deviceID": "string",
          "imei": "string",
          "osplatform": "string",
          "osversion": "string",
          "version": "string"
        },
      }
  
      const fetchData = (await request.post(api.get_user_wallet, params, {
        headers: {
          "Content-Type": "application/json",
        },
      })) as any
      if (fetchData && fetchData.code == 1) {
        if (fetchData.wallet.walletAddress) {
          setWalletAddress(fetchData.wallet?.walletAddress);
        }
        if (fetchData.wallet.privateKey) {
          setAoWalletKey(fetchData.wallet?.privateKey);
        }

        // localStorage.setItem('walletAddress', fetchData.wallet.walletAddress)
        // localStorage.setItem('walletKey', fetchData.wallet.privateKey)
      } else {
      }
      return fetchData.data
    } catch (err) {
      console.error(err);
      return null;
    }
  }
  const handleMouseLeave = () => {
    setHighlightedArea(null);
  };
  useEffect(()=>{
    getUserWallet();
    
  },[])
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setWindowWidth(window.innerWidth);
        setWindowHeight(window.innerHeight);
      };
      window.addEventListener('resize', handleResize);
      handleResize();
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);
  useEffect(() => {
    // Check if userInfo is a string before using replace
    if (typeof userInfo === 'string') {
        const icoConfigStr = userInfo
            .replace(/\n/g, '')  // Remove newlines
            .replace(/“|”/g, '"'); // Replace non-standard quotes
        
        try {
            const icoConfig = JSON.parse(icoConfigStr);
            setUserInfo(icoConfig); // Set the parsed config to state
        } catch (error) {
            console.error("Error parsing userInfo:", error);
        }
    }

    // Check if npc.icoConfig is a string before using replace
    if (npc && typeof npc.icoConfig === 'string') {
        const npcConfigStr = npc.icoConfig
            .replace(/\n/g, '')  // Remove newlines
            .replace(/“|”/g, '"'); // Replace non-standard quotes
        
        try {
            const npcConfig = JSON.parse(npcConfigStr);
            setNpc(npcConfig); // Set the parsed config to state
        } catch (error) {
            console.error("Error parsing npcConfig:", error);
        }
    }

}, [userInfo, npc]);



  const areas = [
    { id: 1, x: '45%', y: '22%', width: 16, height: 20, src: `/dianshi.png` },
    { id: 2, x: '63%', y: '28%', width: 9, height: 33, src: `/youxiji.png` },
    { id: 3, x: '75%', y: '64%', width: 10, height: 29, src: `/shafa.png` },
    { id: 4, x: '46%', y: '68.4%', width: 7, height: 16, src: userInfo.sofa },

  ];

  if (typeof window !== 'undefined') {
    const shouldShowExtraAreas = localStorage.getItem("addfirend") === "true";
    if (shouldShowExtraAreas) {
      areas.push(
        { id: 5, x: '54.6%', y: '68.4%', width: 7, height: 16, src: npc.sofa },
        { id: 6, x: '55%', y: '58%', width: 6, height: 6, src: `/Session.png` }
      );
    }

    areas.push(
      { id: 6, x: '48%', y: '12%', width: 10, height: 6, src: `/ComingSoon.png` },
      { id: 7, x: '62%', y: '20%', width: 10, height: 6, src: `/PKGame.png` },
      { id: 8, x: '74%', y: '56%', width: 10, height: 6, src: `/Openfriendlist.png` },
      { id: 9, x: '44%', y: '58%', width: 10, height: 6, src: `/PersonalCenter.png` }
    );
  }

  const [inputValue, setInputValue] = useState('');
  const [conversationId, setConversationId] = useState('');

  const handleName = async () => {
    if (inputValue.trim() !== '') {
      setLoading(true);
      setFooterData(true);
      const npc = JSON.parse(localStorage.getItem('npc') || '{}');
      if (npc.icoConfig) {
        
      
      const icoConfigStr = npc.icoConfig
      .replace(/\n/g, '')  // 移除换行符
      .replace(/“|”/g, '"'); // 替换非标准引号
      const icoConfig = JSON.parse(icoConfigStr);
      setNpcImg(icoConfig.bust_chat);
      }
      setNpcName(npc.name);
      setMessage("  ");
      const chatResponse = await request.post(api.post_npc_agent_chatStream, {
        npcId: npc?.id,
        conversationType: "chat",
        query: `${inputValue}`,
        conversationId: conversationId,
      });
      if (typeof chatResponse === 'string') {
        const filteredLines = chatResponse.split('\n');
        const lines = filteredLines.filter(line => line.trim() !== '');
        const result: string[] = [];
        lines.forEach(line => {
          const jsonData = JSON.parse(line.replace('data:', ''));
          setConversationId(jsonData.conversation_id);
          if (jsonData.event === 'message' || jsonData.event === 'agent_message') {
            result.push(jsonData.answer);
          } else if (jsonData.event === 'message_file') {
            result.push(jsonData.url);
          }
        });
        setInputValue('');
        setMessage(result.filter(item => item !== "").join(""));
        setLoading(false);
      }
    }
  };

  const [friendListFriends, setFriendListFriends] = useState<any[]>([]);
  const handleClick = async (areaId: number) => {
    setCurrentContent(areaId);
    if (areaId == 3) {
      const friendListResponse = await request.post(api.post_hangout_friend_list);
      if (friendListResponse && typeof friendListResponse === 'object') {
        const typedFriendListResponse = friendListResponse as FriendListResponseType;
        if (typedFriendListResponse.code === 1) {
          const friends = typedFriendListResponse.friends || [];
          if (Array.isArray(friends)) {
            setFriendListFriends(friends);
          }
        }
      }
    }
    if (areaId == 2) {
      router.push("/personality"); // 标记调整pk路径
    }
  };

  const containerRef = useRef(null);

  const handleClickOutside = (event: any) => {
    if (containerRef.current && !(containerRef.current as HTMLElement).contains(event.target)) {
      setCurrentContent(null);
      setFooterData(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleName();
    }
  };

  useEffect(() => {
    // 模拟加载时间
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  function markdownToText(markdown:any) {
    // 去除所有的链接格式
    let text = markdown.replace(/\[(.*?)\]\((.*?)\)/g, '$1');
    // 去除所有的强调格式（斜体、加粗等）
    text = text.replace(/\*\*(.*?)\*\*/g, '$1');
    text = text.replace(/\*(.*?)\*/g, '$1');
    text = text.replace(/__(.*?)__/g, '$1');
    // 去除所有的标题格式
    text = text.replace(/^#+\s(.*)$/gm, '$1');
    // 去除所有的列表格式
    text = text.replace(/^\s*[-*]\s(.*)$/gm, '$1');
    // 去除单行代码块格式
    text = text.replace(/`(.*?)`/g, '$1');
    // 去除多行代码块格式
    text = text.replace(/```[\s\S]*?```/g, '');
    return text.trim();
  }

  const [markdownText, setMarkdownText] = useState('');
  const [plainText, setPlainText] = useState('');

  useEffect(() => {
    const storedMarkdown = localStorage.getItem("instructions");
    if (storedMarkdown) {
      setMarkdownText(storedMarkdown);
      setPlainText(markdownToText(storedMarkdown));
    }
  }, []);


  return (
    <div>
      {isLoading &&
        <div style={{ zIndex: 100, background: '#212121', width: '100%', height: '100vh', display: "flex", justifyContent: "center" }}>
          <img src="/logo_loading.svg" alt="" style={{ width: "140px"}} className='logo_loading' />
        </div>
      }
      <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundImage: `url(/hang_out_bg.png)`,
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
          }}
          onMouseLeave={handleMouseLeave}
        >
          {areas.map((area) => {
            const { x, y, width, height } = calculateAreaPosition(area, windowWidth, windowHeight);
            return (
              <img
                onClick={() => handleClick(area.id)}
                key={area.id}
                style={{
                  cursor: 'pointer',
                  position: 'absolute',
                  left: x,
                  top: y,
                  width,
                  // height,
                  filter: (highlightedArea !== null && typeof highlightedArea === 'string' && (area.id === 1 || area.id === 2 || area.id === 3 || area.id === 4 || area.id === 5) && highlightedArea.includes(area.id.toString()))
                    ? 'drop-shadow(0 0 8px #FFEA94) drop-shadow(0 0 4px #FFEA94)'
                    : 'none',
                }}
                src={area.src}
                alt=""
                onMouseEnter={() => handleMouseEnter(area.id.toString())}
                onMouseLeave={() => setHighlightedArea(null)}
              />
            );
          })}
          {currentContent === 3 && (
            <div style={{ position: "absolute", width: "100%", height: '100%', color: "#fff" }}>
              <div ref={containerRef} style={{ width: '480px', height: '444px', background: '#1E1E1E', marginTop: "10%", marginLeft: "37%", border: '2px solid #C8C8C8', padding: "20px 50px" }}>
                <div style={{ display: "flex", justifyContent: 'space-between', fontSize: "24px",marginBottom:"20px" }}><p>Open friend list</p><p style={{ cursor: "pointer" }} onClick={() => setCurrentContent(null)}>X</p></div>
                <div style={{height:"350px",overflowY:"auto"}}>
                  {friendListFriends && friendListFriends.length > 0 ? (
                    friendListFriends.map((friend, index) => (
                      <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                        <img src={friend.ico} style={{ marginRight: "14px", width: "48px", height: "48px", borderRadius: "50%" }} />
                        <p>{friend.npcName}</p>
                      </div>
                    ))
                  ) : (
                    <p><CircularProgress size={50} sx={{ color: '#ececec' }} /></p>
                  )}
                </div>
              </div>
            </div>
          )}
          {currentContent === 4 && (
            <div style={{ position: "absolute", width: "100%", height: '80%', color: "#fff" }}>
              <div ref={containerRef} style={{ border: "1px solid #C8C8C8", background: "#1E1E1E", width: "576px", position: 'absolute', top: "30%", left: "30%", padding: "20px 50px" }}>
                <div style={{ display: "flex", justifyContent: 'space-between', fontSize: "28px" }}><p>Personal Center</p><p style={{ cursor: "pointer" }} onClick={() => setCurrentContent(null)}>X</p></div>
                <div style={{ display: "flex", alignItems: "flex-start" }}>
                  {/* {bustIco && <img style={{ width: '90px' }} src={bustIco} alt="" />} */}
                  <img style={{ width: '100px',marginTop:"24px" }} src={userInfo.bust_person_center} alt="" />
                  <div style={{ marginLeft: "20px", width: "80%" }}>
                    <p style={{ marginTop: '20px' }}>{localStorage.getItem("inputValueName")}</p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "40px" }}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <img src="/wallte.svg" alt="" />
                        <p style={{ margin: '0 0 0 10px' }}>Soul Address</p>
                      </div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                      {walletAddress && typeof walletAddress === 'string' && (
                          <p style={{ margin: '0 0 0 10px' }}>
                              {walletAddress.slice(0, 4) + '***' + walletAddress.slice(-4)}
                          </p>
                      )}
                        <img
                          style={{ marginLeft: "10px", cursor: "pointer" }}
                          src="/copy.svg"
                          alt=""
                          onClick={handleCopyClick(walletAddress)}
                        />
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "40px" }}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <img src="/keys.svg" alt="" />
                        <p style={{ margin: '0 10px' }}>Private Key</p>
                        <img src="/info-circle.svg" alt="" />

                      </div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <img style={{ marginLeft: "10px", cursor: "pointer" }} src="/copy.svg" alt="" onClick={handleCopyClick(aoWalletKey)} />
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "40px" }}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <img src="/robot.svg" alt="" />
                        <p style={{ margin: '0 10px' }}>AI Instruction</p>
                        <img src="/info-circle.svg" alt="" />

                      </div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {instruction && typeof instruction === 'string' && (
                            <p style={{ margin: '0 0 0 10px' }}>
                                {instruction.slice(0, 4) + '...' + instruction.slice(-4)}
                            </p>
                        )}
                        <img style={{ marginLeft: "10px", cursor: "pointer" }} src="/copy.svg" alt="" onClick={handleCopyClick(instruction)} />
                      </div>
                    </div>
                    {plainText && <div style={{height:"60px",overflowY:'auto',margin:"0 0 16px 24px",}}>
                      {plainText}
                    </div>}
                    <div style={{height:"40px"}}>
                      <a style={{color:'#fff',display: 'flex',alignItems: 'center'}} href="https://discord.com/invite/RsDbxAdtu7"  target="_blank" ><img src="/DC.png" alt="" style={{width:"16px",marginRight:'10px'}}/>Join our DC to discuss</a>
                    </div>
                    <div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {currentContent === 5 && (
            <div style={{ position: "absolute", width: "100%", height: '80%', color: "#fff" }}>
              <div
                ref={containerRef}
                style={{ height: "220px", overflowY: "auto", position: 'absolute', top: "30%", left: "30%", padding: "20px 50px" }}
              >
                <textarea
                  className='input'
                  placeholder='Chat with your friends here!'
                  style={{
                    width: "480px",
                    background: "rgba(0, 0, 0, 0.8)",
                    border: "2px solid rgba(255, 255, 255, 0.4)",
                    color: "#ececec",
                    marginBottom: "20px",
                    outline: "none",
                    padding: "10px",
                    borderRadius: "10px",
                    resize: "none",
                    overflowY: "auto",
                    boxSizing: "border-box"
                  }}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                {!loading && <div
                  onClick={handleName}
                  style={{
                    backgroundImage: "url(/continue_bg.svg)",
                    width: "480px",
                    height: "64px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#000"
                  }}
                >
                  Continue
                </div>}
                {loading && (
                <div style={{
                  backgroundImage: "url(/continue_bg.svg)",
                  width: "480px",
                  height: "64px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#000"
                }}>
                  <CircularProgress size={50} sx={{ color: '#000' }} />
                </div>
              )}

              </div>
            </div>
          )}
        </div>
      </div>
      {/* {loading && (
        <div style={{
          position: 'fixed',
          top: '46%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}>
          <CircularProgress size={60} sx={{ color: 'rgba(0, 0, 0, 0.72)' }} />
        </div>
      )} */}
      {footerData && <Footer npcImg={npcImg} npcName={npcName} message={message} nextQuestion={handleNextQuestion} />}
    </div>
  );
};
const routerHangName = async (router: any) => {
  const fetaData = await request.post(api.post_get_awareness);
  const typedData = fetaData as { code: number; aoAwareness?: any };
  if (typedData.code === 1 && typedData.aoAwareness) {
    localStorage.setItem("aoProfileId",typedData.aoAwareness.awreaveUrl)
    const query = { stage: 'appMain' };
    router.push({
      pathname: '/hangName',
      query: query
    });
  }else {
     const currentStage = localStorage.getItem("currentStage") || 'inputName';
    const query = { stage: currentStage };
    router.push({
      pathname: '/hangName',
      query: query,
    });
  }
};
const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(true); // 默认音乐播放
  const [isRotating, setIsRotating] = useState(true); // 默认旋转
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      isPlaying ? audioRef.current.play() : audioRef.current.pause();
    }
  }, [isPlaying]);

  const toggleMusic = () => {
    setIsPlaying(!isPlaying);
    setIsRotating(!isRotating);
  };

  return (
    <div
      onClick={toggleMusic}
      style={{
        position: 'absolute',
        right: '20px',
        top: '20px',
        cursor: 'pointer',
        width: '48px',
        height: '48px',
        background: 'rgba(0, 0, 0, 0.72)',
        border: '3px solid #C8C8C8',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex:100,
      }}
    >
      <img
        style={{
          animation: isRotating ? 'rotate 3s linear infinite' : 'none',
        }}
        src="/music-fill.svg"
        alt="Music Icon"
      />
      {/* <video controls autoPlay muted loop>
        <source src="/music-file.mp3" type="video/mp4" />
        Your browser does not support the video tag.
      </video> */}
      <audio ref={audioRef} src="/music-file.mp3" autoPlay loop />
    </div>
  );
};

export function HangNameLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [currentStage, setCurrentStage] = useState<string>('');
  const [shouldRender, setShouldRender] = useState(false);
  const { createAOAgentUpload } = UploadToAoChain()
  const [windowWidth, setWindowWidth] = useState<number | null>(null);
  const [windowHeight, setWindowHeight] = useState<number | null>(null);
  const [npc, setNpc] = useState<{} | null>(null);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const npcIco = JSON.parse(localStorage.getItem('npc') || '{}');
      setNpc(npcIco);
  
      if (npcIco.icoConfig) {
        try {
          const npcConfigStr = npcIco.icoConfig
            .replace(/\n/g, '') // 移除换行符
            .replace(/“|”/g, '"'); // 替换非标准引号
          const npcConfig = JSON.parse(npcConfigStr);
          setNpc(npcConfig);

        } catch (error) {
          console.error('Error parsing npcConfig:', error);
        }
      }
    }
  }, []);
  
  
  const areas = [
    { id: 1, x: '45%', y: '22%', width: 16, height: 20, src: `/dianshi.png` },
    { id: 2, x: '63%', y: '28%', width: 9, height: 33, src: `/youxiji.png` },
    { id: 3, x: '75%', y: '64%', width: 10, height: 29, src: `/shafa.png` },
    { id: 4, x: '55%', y: '68.4%', width: 7, height: 16, src: npc && (npc as { sofa: string }).sofa}
  ];



  // 这里可以通过 router.query 获取 URL 参数中的 stage
  useEffect(() => {
    const stageFromUrl = router.query.stage as string | undefined;
    
    if (stageFromUrl || router.isReady) {
      setCurrentStage(stageFromUrl || 'inputName');
      if (typeof window !== 'undefined') {
        localStorage.setItem("currentStage",stageFromUrl || 'inputName')
        if (!localStorage.getItem('aoProfileId') ) {
          const userName = localStorage.getItem('accountUserName') ?? ''
          const displayName = localStorage.getItem('accountDisplayName') ?? ''
          const descipt = localStorage.getItem('accountDescription') ?? ''
          const profileImage = localStorage.getItem('accountProfileImage') ?? ''
          const coverImage = localStorage.getItem('accountCoverImage') ?? ''
          if (!userName) { return }
          console.log('执行router query')
          createAOAgentUpload(userName, displayName, descipt, profileImage, coverImage, '')
        }
      }
    }
    setShouldRender(true);
  }, [router.query, router.isReady]);

  useEffect(()=>{
    // routerHangName(router);
  },[])
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setWindowWidth(window.innerWidth);
        setWindowHeight(window.innerHeight);
      };
      window.addEventListener('resize', handleResize);
      handleResize();
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);


  const handleContinue = () => {
    if (currentStage === 'inputName') {
      router.push({ query: { stage: 'questions' } });
      setCurrentStage('questions');
    } else if (currentStage === 'questions') {
      router.push({ query: { stage: 'lookContinue' } });
      setCurrentStage('lookContinue');
    } else if (currentStage === 'lookContinue') {
      router.push({ query: { stage: 'addFriend' } });
      setCurrentStage('addFriend');
    } else if (currentStage === 'addFriend') {
      router.push({ query: { stage: 'appMain' } });
      setCurrentStage('appMain');
    }
  };

  return (
    <div className='hang_name'>
      {currentStage!== 'appMain' && (
        <>
          <img
            src='/hang_out_bg.png'
            alt="bg"
            style={{
              position: 'fixed',
              width: '100%',
              height: '100%',
            }}
          />
          {areas.map((area) => {
            const { x, y, width, height } = calculateAreaPosition(area, windowWidth, windowHeight);
            return (
              <img
                key={area.id}
                style={{
                  position: 'absolute',
                  left: x,
                  top: y,
                  width,
                }}
                src={area.src ?? ''}
                alt=""
              />
            );
          })}
        </>
      )}
      <MusicPlayer />
      {shouldRender && currentStage === 'inputName' && <InputName onContinue={handleContinue} />}
      {shouldRender && currentStage === 'addFriend' && <AddFriend onContinue={handleContinue}/>}
      {shouldRender && currentStage === 'questions' && <QuestionComponent onContinue={handleContinue} />}
      {shouldRender && currentStage === 'appMain' && <Appmain onContinue={handleContinue} />}
      {shouldRender && currentStage === 'lookContinue' && <LookContinue onContinue={handleContinue} />}
      
    </div>
  );
}