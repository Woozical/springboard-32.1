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
            (prev, current, idx, nums) => {
                if (idx === nums.length - 1){
                    return (prev + current) / nums.length;
                } else {
                    return (prev + current);
                }
            }
        )
        return response.json({response : {operation: 'mean', value: mean}});
    } catch (err) {
        next(err);
    }
}

function medianHandler(request, response, next){
    try{
        const nums = getNums(request.query).sort((a, b) => a - b);
        let median;
        if (nums.length % 2 === 0){
            median = (nums[nums.length/2] + nums[(nums.length/2)-1]) / 2;
        } else {
            median = nums[Math.trunc(nums.length / 2) ];
        }
        return response.json({response : {operation: 'median', value: median}});
    } catch (err) {
        next(err);
    }
}

function modeHandler(request, response, next){
    try{
        const nums = getNums(request.query);
        const count = {};
        nums.forEach((num) => {
            count[num] = count[num] ? count[num] + 1 : 1;
        })
        const mode = Object.keys(count).reduce((prev, cur) => {
            return count[prev] > count[cur] ? prev : cur
        })
        return response.json({response : {operation: 'mean', value: mode}});
    } catch (err) {
        next(err);
    }
}


app.get('/mean', meanHandler);
app.get('/median', medianHandler);
app.get('/mode', modeHandler);

app.use((err, request, response, next) => {
    return response.status(err.status).json({error : {msg : err.msg, status: err.status}});
})

app.listen(3000, ()=> console.log('app listening on port 3000...'));