const handleErrors=(err)=>{
    //console.log("Full Error Object:", err);
     console.log("Message:", err.message);
    // console.log("Code:", err.code);

    let errors={email:'',password:'',user:'',role:'',};

    if(err.code===11000){
        errors.email='That email already exists';
        return errors;
    }

    if (err._message === 'User validation failed') {
        Object.values(err.errors).forEach((error) => {
            //console.log('Validation Error:', error); // Log each validation error
            const { properties } = error;
            if (properties && properties.path in errors) {
                errors[properties.path] = properties.message;
            }
        });
    }

    if(err.message==='incorrect email'){
        errors.email='given email is not registered';
    }

    if(err.message==='incorrect password'){
        errors.password='password galat hain';
    }

    return errors;
}

const foodErrors=(err)=>{
    let errors={name:'',price:'',category:'',serialNumber:'',};
    if (err._message === 'Menu validation failed') {
        Object.values(err.errors).forEach((error) => {
            //console.log('Validation Error:', error); // Log each validation error
            const { properties } = error;
            if (properties && properties.path in errors) {
                errors[properties.path] = properties.message;
            }
        });
    }

    if (err.customError) {
        errors.serialNumber = err.customError;
    }
    
    return errors;
}
export {handleErrors,foodErrors};