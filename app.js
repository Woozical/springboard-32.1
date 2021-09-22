const express = require('express');
const ExpressError = require('./error');

app = express();

function getNums(query){
    if (!query.nums){
        throw new ExpressError('nums are required', 400);
    }
    const nums = query.nums.split(',').map(val => {
        const newVal = +val;
        if (newVal !== newVal) throw new ExpressError(`${val} is not a number`, 400);
        else return newVal;
    });
    return nums;
}

function meanHandler(request, response, next){
    try{
        const mean = getNums(request.query).reduce(
            (prev, current, idx) => {
                if (idx === nums.length - 1){
                    return (+prev + +current) / nums.length;
                } else {
                    return (+prev + +current);
                }
            }
        )
        return response.send(`Mean is: ${mean}`); 
    } catch (err) {
        next(err);
    }
}

app.get('/mean', meanHandler);


app.use((err, request, response, next) => {
    return response.send(`ERROR: ${err.msg} (Code: ${err.status})`);
})

app.listen(3000, ()=> console.log('app listening on port 3000...'));