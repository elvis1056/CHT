window.request = {
  $get: (url, method, headers, data, options) => {
    return fetch(url, { // url 請求位置
        method: method || 'GET', //請求方法
        // 發送給伺服器的資料
        data,
        headers: headers || {
            'content-type': 'application/json'
        },
        ...options
    }).then(res => res.json())
  }
}