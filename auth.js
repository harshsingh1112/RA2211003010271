const axios = require('axios');

const getAuthToken = async () => {
    try {
        const response = await axios.post('http://20.244.56.144/test/auth', {
            companyName: "Afford Medical Technologies",  
            clientID: "dd15cd88-9c86-44b0-9a21-a3680fcd4f62",      
            clientSecret: "SvtYSXAEvLWBOFOE", 
            ownerName: "Harsh Singh",         
            ownerEmail: "hs1195@srmist.edu.in", 
            rollNo: "RA2211003010271"         
        });

        console.log("✅ Authentication Successful! Token:");
        console.log(response.data);
    } catch (error) {
        console.error("❌ Authentication Failed! Error Details:");
        if (error.response) {
            console.error("Status Code:", error.response.status);
            console.error("Response Data:", error.response.data);
        } else {
            console.error("Error Message:", error.message);
        }
    }
};

// Run the function
getAuthToken();
