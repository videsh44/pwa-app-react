import axios from 'axios'
let params = (new URL(document.location)).searchParams
if (params.has('token')) {
    var web_token = params.get('token')
}
export const userprofiledata = async () => {
    let token = localStorage.getItem('user_signin_token')
    var config = {};
    if (token !== null) {
        var config = {
            "Authorization": `Bearer ${token}`
        }
    } else if (web_token !== undefined) {
        var config = {
            "Authorization": `Bearer ${web_token}`
        }
    }
    let userdetail = await axios.get('https://theminoritypsychologynetwork.org/wp-json/ca/v1/getProfile',
        {
            headers: config
        })
    return userdetail;
}


export const Unreadnotification = async () => {
    let _token = localStorage.getItem("token")
    let _webtoken = localStorage.getItem("webtoken")
    var config = {};
    if (_token !== null) {
        var config = {
            "Authorization": `Bearer ${_token}`
        }
    } else if (_webtoken !== null) {
        var config = {
            "Authorization": `Bearer ${_webtoken}`
        }
    }
    if (_token != null || _webtoken != null) {
        try {
            const request = await axios.get(`https://theminoritypsychologynetwork.org/wp-json/ca/v1/getTotalUnreadNotification`, {
                headers: config
            })
            if ('caches' in window) {
                caches.keys().then((names) => {
                    names.forEach(name => {
                        caches.delete(name);
                    })
                });
            }
            let unread_obj = {
                Announcement_Event: request.data.total_unread,
                Event_obj: request.data.total_event
            }
            return unread_obj;
        } catch (error) {
            console.log(error)
        }
    }
}