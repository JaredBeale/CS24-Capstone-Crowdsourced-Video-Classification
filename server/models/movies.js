

/* typically database calls are asyncronous so there will be some
time between calling and receiving. This is why we use callbacks.

*/
async function decideNextClipWithUsername(username,callback){
  // .. logic here with postGRES
  callback("movie123.mp4")
}

module.exports.decideNextClipWithUsername = decideNextClipWithUsername;
