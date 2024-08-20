/*
* 作者 : Yu-Ping Tseng (pingsnotes.github.io)
* 程式名稱 : 運動紀錄機器人
* 簡述 : 這是一個可以紀錄運動群組打卡成果訊息的 LINE 機器人，將資料存放在 Google Sheet 中，基於 App Script 語法
* 授權: Apache 2.0
* 聯絡方式: contact@pingsnotes.github.io
* 最新更新 : 2024 / 08 / 17
*/

function doPost(e) {
                  // LINE Messenging API Token
                  var CHANNEL_ACCESS_TOKEN = 'co0+feyuh3ZD6+XQ3enYRIGe6XbXQP1WNUtZo0m0Qym4hrFlWfbpQDFr4+eT5LOP6yd3Sbt0Vz33dzRWUUZpRWjlncvnn6D8I2X6GLxuMnUnU3BZ+Cj+LQ0TZeY7sIZtZmx+1dlIDD04tEnpcJlP/QdB04t89/1O/w1cDnyilFU='; // LINE Bot API Token
                  // 以 JSON 格式解析 User 端傳來的 e 資料
                  var msg = JSON.parse(e.postData.contents);
              
                  // for debugging
                  Logger.log(msg);
                  console.log(msg);
              
                  /* 
                  * LINE API JSON 解析資訊
                  *
                  * replyToken : 一次性回覆 token
                  * user_id : 使用者 user id，查詢 username 用
                  * userMessage : 使用者訊息，用於判斷是否為預約關鍵字
                  * event_type : 訊息事件類型
                  */
                  const replyToken = msg.events[0].replyToken;
                  const user_id = msg.events[0].source.userId;
                  const userMessage = msg.events[0].message.text;
                  const event_type = msg.events[0].source.type; 
              
                  /*
                  * Google Sheet 資料表資訊設定
                  *
                  * 將 sheet_url 改成你的 Google sheet 網址
                  * 將 sheet_name 改成你的工作表名稱
                  */
                  const sheet_url = 'https://docs.google.com/spreadsheets/d/124ZLiF1zOkJrMw9_5r6JnVj2v50R8ouGqPcCD2xMUAg/edit?usp=sharing';
                  const sheet_name = 'cumulation';
                  const SpreadSheet = SpreadsheetApp.openByUrl(sheet_url);
                  const reserve_list = SpreadSheet.getSheetByName(sheet_name);
              
                  const sheet_name_2 = 'record';
                  const SpreadSheet_record = SpreadsheetApp.openByUrl(sheet_url);
                  const record_list = SpreadSheet_record.getSheetByName(sheet_name_2);
              
              
                  // 必要參數宣告
                  var current_hour = Utilities.formatDate(new Date(), "Asia/Taipei", "HH"); // 取得執行時的當下時間
                  var current_list_row = reserve_list.getLastRow(); // 取得工作表最後一欄（ 直欄數 ）
                  var reply_message = []; // 空白回覆訊息陣列，後期會加入 JSON
              
                  // 查詢傳訊者的 LINE 帳號名稱
                  function get_user_name() {
                      // 判斷為群組成員還是單一使用者
                      switch (event_type) {
                          case "user":
                              var nameurl = "https://api.line.me/v2/bot/profile/" + user_id;
                              break;
                          case "group":
                              var groupid = msg.events[0].source.groupId;
                              var nameurl = "https://api.line.me/v2/bot/group/" + groupid + "/member/" + user_id;
                              break;
                      }
              
                      try {
                          //  呼叫 LINE User Info API，以 user ID 取得該帳號的使用者名稱
                          var response = UrlFetchApp.fetch(nameurl, {
                              "method": "GET",
                              "headers": {
                                  "Authorization": "Bearer " + CHANNEL_ACCESS_TOKEN,
                                  "Content-Type": "application/json"
                              },
                          });
                          var namedata = JSON.parse(response);
                          var reserve_name = namedata.displayName;
                      }
                      catch {
                          reserve_name = "not avaliable";
                      }
                      return String(reserve_name)
                  }
              
                  // 回傳訊息給line 並傳送給使用者
                  function send_to_line(reply_message) {
                      var url = 'https://api.line.me/v2/bot/message/reply';
                      UrlFetchApp.fetch(url, {
                          'headers': {
                              'Content-Type': 'application/json; charset=UTF-8',
                              'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
                          },
                          'method': 'post',
                          'payload': JSON.stringify({
                              'replyToken': replyToken,
                              'messages': reply_message,
                          }),
                      });
                  }
              
                  // 將輸入值 word 轉為 LINE 文字訊息格式之 JSON
                  function format_text_message(word) {
                      let text_json = [{
                          "type": "text",
                          "text": word
                      }]
              
                      return text_json;
                  }
              
                  function getRewardPhrase(timeObject, level) {
                      // 取得秒數
                      var seconds = timeObject.getSeconds();
              
                      // 將秒數除以10，取得餘數
                      var remainder = seconds % 15;
              
                      // 定義不同餘數對應的讚賞詞句
                      if (level == 1) {
                          // 達標
                          var rewardPhrases = [
                          "好棒棒！",
                          "你的努力大家都看得見！",
                          "讚讚！怎麼辦到的~",
                          "厲害ㄟ",
                          "不錯喔！繼續保持~",
                          "真的是有在認真運動，值得給你掌聲！",
                          "你/妳做到了！繼續向更高的目標前進吧！",
                          "每一步都在進步，為自己感到驕傲吧！",
                          "你/妳真努力，讚讚讚！",
                          "堅持就是勝利！繼續加油喔！",
                          "這個速度太可以了，未來可期！",
                          "一步一腳印，你的進步大家有目共睹！",
                          "好樣的！成功總是屬於有準備的人！",
                          "持之以恆就是這樣，棒棒的！",
                          "每個堅持的瞬間都值得被讚美！"
                          ];
                      } else {
                          // 超標
                          var rewardPhrases = [
                          "太厲害了！給你五顆星不能再多",
                          "你的努力大家都看得見！",
                          "讚啦！要不要跟大家分享持之以恆的秘訣~",
                          "厲害ㄟ，表現一級棒！",
                          "讚讚讚！好人一生平安~",
                          "你/妳超越了自己，真是令人佩服！",
                          "突破極限，這才是實力的展現！",
                          "今天的你/妳，光芒四射！",
                          "不愧是運動達人，繼續燃燒吧！",
                          "這樣的表現，我只能說：驚豔！",
                          "哇！這不是普通的努力，這是超凡的毅力！",
                          "今天的你/妳，真的把極限推到新高度了！",
                          "無敵！這樣的表現，讓我對你/妳刮目相看！",
                          "強者的世界，我只能說：佩服！",
                          "太太太厲害了，值得學習！"
                          ];
                      }
              
                      // 根據餘數返回對應的讚賞詞句
                      var rewardPhrase = rewardPhrases[remainder];
                      return rewardPhrase;
                  }
              
                  var reserve_name = get_user_name();
              
                  if (typeof replyToken === 'undefined') {
                      return;
                  };
              
              
                  function calculateWeeklyActivity(member_name, startDate, endDate) {
                      var totalMinutes = 0;
                      var recordedDays = new Set(); // 使用集合來存儲已記錄的日期，確保日期的唯一性
              
                      // 獲取所有記錄
                      var allRecords = record_list.getRange(1, 1, record_list.getLastRow(), 3).getValues();
              
                      // 遍歷記錄
                      allRecords.forEach(function(record) {
                          var recordDate = new Date(record[0]);
                          var member = record[1];
                          var minutes = record[2];
                          var oriDate = record[3]; // 假設這是第4列數據
              
                          // 檢查記錄是否符合條件
                          if (member === member_name && recordDate >= startDate && recordDate <= endDate && minutes > 0 && oriDate !== '') {
                              totalMinutes += minutes; // 累加運動分鐘數
                              recordedDays.add(recordDate.toDateString()); // 將日期添加到集合中
                          }
                      });
              
                      return {
                          totalDays: recordedDays.size, // 使用集合的大小作為總天數
                          totalMinutes: totalMinutes
                      };
                  }
              
                  // 從訊息中提取第一行和第二行
                  var lines = userMessage.split('\n');
                  var firstLine = lines[0];
                  var secondLine = lines.length > 1 ? lines[1] : '';
                  var item = '';
              
                  // 檢查第二行是否包含#，若有，將內容去掉#作為運動項目
                  if (secondLine.startsWith('#')) {
                      item = secondLine.substring(1).trim();
                  }
              
                  // 檢查第一行是否包含 "+" 並找出第一個 "+"
                  var plusIndex = firstLine.indexOf("+");
                  // 檢查第一行是否包含兩個 "+"，如果是，則找出第二個 "+"
                  var secondPlusIndex = firstLine.indexOf("+", plusIndex + 1);
              
                  // 若找到 "+"，則提取 "+" 後的數字作為分鐘數
                  if (plusIndex !== -1) {
                      // 若找到第二個 "+"
                      if (secondPlusIndex !== -1) {
                          // 提取第二個 "+" 後的數字作為分鐘數
                          var minutes = parseInt(firstLine.substring(secondPlusIndex + 1));
                      } else {
                          // 提取第一個 "+" 後的數字作為分鐘數
                          var minutes = parseInt(firstLine.substring(plusIndex + 1));
                      }
                      // 獲取當前日期和時間
                      var currentDate = new Date();
                      var formattedDate = Utilities.formatDate(currentDate, "Asia/Taipei", "yyyy/MM/dd");
                      var currentDay = currentDate.getDay(); // 獲取當前星期幾，0 表示星期天，1 表示星期一，以此類推
                      
                      // 設定起始日為本週的星期一
                      var startDate = new Date(currentDate);
                      startDate.setDate(currentDate.getDate() - currentDay + (currentDay === 0 ? -6 : 1));
                      // 設定結束日為本週的星期天
                      var endDate = new Date(currentDate);
                      endDate.setDate(currentDate.getDate() - currentDay + (currentDay === 0 ? 0 : 7)); // 設定結束日為本週的星期天
              
                      // 將 startDate 設定為星期一的凌晨0點
                      startDate.setHours(0, 0, 0, 0);
              
                      // 將 endDate 設定為星期日的23:59
                      endDate.setHours(23, 59, 59, 999);
              
                      // 將使用者名稱、日期和運動分鐘數、運動項目寫入到 Google Sheet 中的下一行
                      record_list.appendRow([formattedDate, reserve_name, minutes, currentDate, item]);        
              
                      // 計算本週成員總共運動時間
                      var result = calculateWeeklyActivity(reserve_name, startDate, endDate);
              
                      reserve_list.appendRow([startDate, currentDate, reserve_name, result.totalDays, result.totalMinutes]);
              
                      // 回訊息: xx成員本週總共運動xx分鐘，這個感覺會製造大家的焦慮~先拿掉
                      // reply_message = format_text_message(reserve_name + "本週跑了" + totalDays + "天共" + totalMinutes + "分鐘");
              
                      // 若找到第二個 "+"
                      if (secondPlusIndex !== -1) {
                          // 若紀錄為"++"，則回傳統計數據
                          reply_message = reserve_name + "本週運動了" + result.totalDays + "天共" + result.totalMinutes + "分鐘";
                      } else {
                          // 提取第一個 "+" 後的數字作為分鐘數
                          reply_message = reserve_name + "本週";
                      }
              
                      // 如果 totalDays >= 6 且 totalMinutes >= 120，設置回覆訊息為達標訊息
                      if (result.totalDays >= 6 && result.totalMinutes >= 120 && minutes > 0) {
                          reply_message += "已超標，" + getRewardPhrase(currentDate, 2);
                      } else if (result.totalDays >= 3 && result.totalMinutes >= 60 && minutes > 0) {
                          // 如果 totalDays >= 3 且 totalMinutes >= 60，設置回覆訊息為達標訊息
                          reply_message += "已達標，" + getRewardPhrase(currentDate, 1);
                      }
              
                      // 只有當reply_message不為"[名字]本週"時才傳送回覆訊息
                      if (reply_message.trim() !== reserve_name + "本週") {
                          send_to_line(format_text_message(reply_message));
                      }
                  }
                  // 其他非關鍵字的訊息則不回應（ 避免干擾群組聊天室 ）
                  else {
                      console.log("else here,nothing will happen.")
                  }
              }
              