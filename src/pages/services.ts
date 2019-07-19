const apiUrl = `https://pwabuilder-api-prod.azurewebsites.net/serviceworkers`;
const fetch = require('node-fetch');


export async function getCode(serviceWorkerId: number) {
    return new Promise<void>(async (resolve, reject) => {
    try {
        await fetch(`${apiUrl}/getServiceWorkersDescription?ids=${serviceWorkerId}`)
            .then
            ((res: any) => res.json()).then((data: any) => {

            });
    }
    catch (e) { 
        
    }
    });

}