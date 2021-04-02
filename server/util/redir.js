/*
*   redirect to a certain path
*/
module.exports = (res, path, status = 302)=>{
    res.status(status)
    res.setHeader("location", path)
    res.setHeader("Cache-control", 'no-cache, no-store')
    res.send()
}