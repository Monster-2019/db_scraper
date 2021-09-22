const groupNo = [
  338839, // 上海租房@长宁租房
  196844, // 上海租房@长宁租房/徐汇/静安租房
  467799, // 上海租房@房东直租
  511562, // 上海好室友
  146409, // 上海租房
  383972, // 上海租房
  190720, // 上海租房

]

const keywords = ["2号线", "中山公园", "江苏路", "娄山关路", "天山SOHO", "北新泾", '淞虹路']
// const keywords = ["2号线"]

const userAgents = [
  'Mozilla / 5.0(Windows NT 10.0; Win64; x64) AppleWebKit / 537.36(KHTML, like Gecko) Chrome / 70.0.3538.77 Safari / 537.36',
  'Mozilla / 5.0(X11; Ubuntu; Linux x86_64) AppleWebKit / 537.36(KHTML, like Gecko) Chrome / 55.0.2919.83 Safari / 537.36',
  'Mozilla / 5.0(Macintosh; Intel Mac OS X 10_8_3) AppleWebKit / 537.36(KHTML, like Gecko) Chrome / 54.0.2866.71 Safari / 537.36',
  'Mozilla / 5.0(X11; Ubuntu; Linux i686 on x86_64) AppleWebKit / 537.36(KHTML, like Gecko) Chrome / 53.0.2820.59 Safari / 537.36',
  'Mozilla / 5.0(Macintosh; Intel Mac OS X 10_9_2) AppleWebKit / 537.36(KHTML, like Gecko) Chrome / 52.0.2762.73 Safari / 537.36',
  'Mozilla / 5.0(Windows NT 10.0; Win64; x64) AppleWebKit / 537.36(KHTML, like Gecko) Chrome / 70.0.3538.102 Safari / 537.36 Edge / 18.19582',
  'Mozilla / 5.0(Windows NT 10.0; Win64; x64) AppleWebKit / 537.36(KHTML, like Gecko) Chrome / 70.0.3538.102 Safari / 537.36 Edge / 18.19577',
  'Mozilla / 5.0(X11) AppleWebKit / 62.41(KHTML, like Gecko) Edge / 17.10859 Safari / 452.6',
  'Mozilla / 5.0(Windows NT 10.0; Win64; x64) AppleWebKit / 537.36(KHTML like Gecko) Chrome / 51.0.2704.79 Safari / 537.36 Edge / 14.14931',
  'Mozilla / 5.0(Windows NT 6.1; WOW64; rv: 77.0) Gecko / 20190101 Firefox / 77.0',
  'Mozilla / 5.0(Windows NT 10.0; WOW64; rv: 77.0) Gecko / 20100101 Firefox / 77.0',
  'Mozilla / 5.0(X11; Linux ppc64le; rv: 75.0) Gecko / 20100101 Firefox / 75.0',
  'Mozilla / 5.0(Windows NT 6.1; WOW64; rv: 39.0) Gecko / 20100101 Firefox / 75.0',
  'Mozilla / 5.0(Macintosh; U; Intel Mac OS X 10.10; rv: 75.0) Gecko / 20100101 Firefox / 75.0',
  'Mozilla / 5.0(Windows NT 6.1; WOW64; Trident / 7.0; AS; rv: 11.0) like Gecko',
  'Mozilla / 5.0(compatible, MSIE 11, Windows NT 6.3; Trident / 7.0; rv: 11.0) like Gecko',
  'Mozilla / 5.0(compatible; MSIE 10.6; Windows NT 6.1; Trident / 5.0; InfoPath.2; SLCC1; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; .NET CLR 2.0.50727) 3gpp - gba UNTRUSTED / 1.0',
  'Mozilla / 5.0(compatible; MSIE 10.0; Windows NT 7.0; InfoPath.3; .NET CLR 3.1.40767; Trident / 6.0; en - IN)',
  'Mozilla / 5.0(compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident / 6.0)',
  'Mozilla / 5.0(Macintosh; Intel Mac OS X 10_9_3) AppleWebKit / 537.75.14(KHTML, like Gecko) Version / 7.0.3 Safari / 7046A194A',
  'Mozilla / 5.0(iPad; CPU OS 6_0 like Mac OS X) AppleWebKit / 536.26(KHTML, like Gecko) Version / 6.0 Mobile / 10A5355d Safari / 8536.25',
  'Mozilla / 5.0(Macintosh; Intel Mac OS X 10_6_8) AppleWebKit / 537.13 + (KHTML, like Gecko) Version / 5.1.7 Safari / 534.57.2',
  'Mozilla / 5.0(Macintosh; Intel Mac OS X 10_7_3) AppleWebKit / 534.55.3(KHTML, like Gecko) Version / 5.1.3 Safari / 534.53.10',
  'Mozilla / 5.0(iPad; CPU OS 5_1 like Mac OS X) AppleWebKit / 534.46(KHTML, like Gecko) Version / 5.1 Mobile / 9B176 Safari / 7534.48.3'
]

const getUserAgent = () => {
  return userAgents[Math.floor(Math.random() * (0 - userAgents.length) + userAgents.length)]
}

//构造请求头-ip
const returnIp = () => {
  return (
    Math.floor(Math.random() * (10 - 255) + 255) +
    "." +
    Math.floor(Math.random() * (10 - 255) + 255) +
    "." +
    Math.floor(Math.random() * (10 - 255) + 255) +
    "." +
    Math.floor(Math.random() * (10 - 255) + 255)
  )
}

module.exports = {
  groupNo,
  keywords,
  getUserAgent,
  returnIp
}