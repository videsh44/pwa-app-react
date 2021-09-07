// [{
//     "relation": ["delegate_permission/common.handle_all_urls"],
//     "target": {
//       "namespace": "android_app",
//       "package_name": "com.mpn",
//       "sha256_cert_fingerprints":
//       ["01:A8:EE:FF:C8:38:77:6D:3F:28:4C:AA:20:A6:65:22:2E:A5:99:29:27:0C:CE:4E:0D:FF:CE:94:3D:C7:92:1F"]
//     }
//   }]


import React, { Component } from 'react'
import $ from 'jquery'
export default class View extends Component {
    componentDidMount() {
        $('#GetFile').on('click', function () {
            $.ajax({
                url: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/172905/test.pdf',
                method: 'GET',
                xhrFields: {
                    responseType: 'blob'
                },
                success: function (data) {
                    var a = document.createElement('a');
                    var url = window.URL.createObjectURL(data);
                    a.href = url;
                    a.download = 'myfile.pdf';
                    document.body.append(a);
                    a.click();
                    a.remove();
                    window.URL.revokeObjectURL(url);
                }
            });
        });
    }
    render() {
        return (
            <button type="button" id="GetFile">Get File!</button>
        );
    }
}
