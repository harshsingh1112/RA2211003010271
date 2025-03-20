const axios = require('axios');

const register = async () => {
    try {
        const response = await axios.post('http://20.244.56.144/test/register', {
            companyName: "Afford Medical Technologies",  
            ownerName: "Harsh Singh",         
            rollNo: "RA2211003010271",       
            ownerEmail: "hs1195@srmist.edu.in",   
            accessCode: "SUfGJv"   
        });

        console.log("✅ Registration Successful! Save these details:");
        console.log(response.data);
    } catch (error) {
        console.error("❌ Registration Failed:", error.response ? error.response.data : error.message);
    }
};


register();
