module.exports = (Schema)=>(req, res, next)=>{
    let values = Schema.validate(req.body)

    if(values.error) return res.status(422).send({
                        errors:values.error.details
                    })
    else next()
}
