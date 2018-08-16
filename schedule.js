function chance(min,max){

    let a = Math.ceil(min);
    let b = Math.floor(max);
    const final = Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    return final
        
}
const final = chance(0,i);