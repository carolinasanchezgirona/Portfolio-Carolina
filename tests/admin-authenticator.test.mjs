import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const src = readFileSync("public/admin-authenticator.js", "utf8");
const factorId = "11111111-2222-4333-8444-555555555555";
const jwt = aal => "x." + Buffer.from(JSON.stringify({aal})).toString("base64url") + ".y";

function browser({factors = [{id:factorId,factor_type:"totp",status:"verified"}],verifiedAal="aal2"} = {}) {
 const calls=[];
 const fetch=async (url,options={}) => {
   calls.push({url,method:options.method,body:options.body&&JSON.parse(options.body)});
   if(url.endsWith("/user"))return {ok:true,json:async()=>({id:"admin",factors})};
   if(url.endsWith("/factors/"+factorId+"/challenge"))return {ok:true,json:async()=>({id:"challenge-1"})};
   if(url.endsWith("/factors/"+factorId+"/verify"))return {ok:true,json:async()=>({
      access_token:jwt(verifiedAal),refresh_token:"refresh",expires_in:3600,user:{id:"admin"},
   })};
   if(url.endsWith("/factors"))return {ok:true,json:async()=>({
      id:factorId,totp:{qr_code:"<svg xmlns='http://www.w3.org/2000/svg'/>",secret:"TESTONLY"},
   })};
   throw new Error("Unexpected request "+url);
 };
 const context={window:{},document:{currentScript:{src:"https://carolinasanchezgirona.com/admin-authenticator.js"}},
   fetch,atob:globalThis.atob,Date,Error,JSON,Uint8Array};
 runInNewContext(src,context);
 return {auth:context.window.AdminAuthenticator,calls};
}
test("registered factor needs second factor when the session is AAL1",async()=>{
 const {auth}=browser();
 const s={access_token:jwt("aal1")};
 const state=await auth.state(s);
 assert.equal(state.enrolled,true);
 assert.equal(state.verified,false);
});
test("non-enrolled admin can enter once before TOTP setup",async()=>{
 const {auth}=browser({factors:[]});
 const state=await auth.state({access_token:jwt("aal1")});
 assert.equal(state.enrolled,false);
 assert.equal(state.verified,true);
});
test("a correct challenge upgrades the session to AAL2",async()=>{
 const {auth,calls}=browser();
 const updated=await auth.verify({access_token:jwt("aal1"),user:{id:"admin"}},factorId,"012345");
 assert.equal(auth.tokenAal(updated),"aal2");
 assert.equal(updated.refresh_token,"refresh");
 assert.equal(calls.filter(c=>c.method==="POST").length,2);
});
test("a password-only result is rejected even after challenge",async()=>{
 const {auth}=browser({verifiedAal:"aal1"});
 await assert.rejects(auth.verify({access_token:jwt("aal1")},factorId,"012345"),/no se ha actualizado/i);
});
test("invalid OTP length is rejected before contacting Supabase",async()=>{
 const {auth,calls}=browser();
 await assert.rejects(auth.verify({access_token:jwt("aal1")},factorId,"12345"),/seis dígitos/);
 assert.equal(calls.length,0);
});
test("QR code is only used as an image, never innerHTML",()=>{
 const {auth}=browser(),img={src:"",alt:""};
 auth.renderQr(img,"<svg/>");
 assert.ok(img.src.startsWith("data:image/svg+xml;charset=utf-8,%3Csvg"));
 assert.match(img.alt,/Authenticator/);
 assert.doesNotMatch(src,/\.innerHTML\s*=/);
});
