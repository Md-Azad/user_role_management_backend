const ar1 = ['Azad',"rakib","shakib"];
const ar2 = ['sadman','sharif','rajjak','Azad'];
ar2.map(el=>{
    if(!ar1.includes(el)){
        ar1.push(el)
    }
})
console.log(ar1);