//Import package
import { Client, auth } from "twitter-api-sdk";
 
// Initialize auth client first
const authClient = new auth.OAuth2User({
  client_id: process.env.NEXT_PUBLIC_CLIENT_ID as string,
  client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET as string,
  callback: process.env.NEXT_PUBLIC_CLIENT_CALLBACK as string,
  scopes: ["tweet.read", "users.read", "offline.access"],
 });

 // Pass auth credentials to the library client 
 const twitterClient = new Client(authClient);
 