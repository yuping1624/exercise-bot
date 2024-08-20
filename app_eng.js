/*
* Author: Yu-Ping Tseng (pingsnotes.github.io)
* Program Name: Exercise Record Bot
* Description: This is a LINE bot that records exercise check-in results for a group, storing the data in Google Sheets, based on App Script.
* License: Apache 2.0
* Contact: contact@pingsnotes.github.io
* Last Updated: 2024 / 08 / 17
*/

function doPost(e) {
                  // LINE Messaging API Token
                  var CHANNEL_ACCESS_TOKEN = 'YOUR_TOKEN'; // LINE Bot API Token
                  // Parse the data received from the User side as JSON
                  var msg = JSON.parse(e.postData.contents);
              
                  // for debugging
                  Logger.log(msg);
                  console.log(msg);
              
                  /* 
                  * LINE API JSON Parsing Information
                  *
                  * replyToken: One-time reply token
                  * user_id: User's user ID, used for querying username
                  * userMessage: User's message, used to check for keywords
                  * event_type: Message event type
                  */
                  const replyToken = msg.events[0].replyToken;
                  const user_id = msg.events[0].source.userId;
                  const userMessage = msg.events[0].message.text;
                  const event_type = msg.events[0].source.type; 
              
                  /*
                  * Google Sheet Information Settings
                  *
                  * Replace sheet_url with your Google Sheet URL
                  * Replace sheet_name with your sheet name
                  */
                  const sheet_url = 'https://docs.google.com/spreadsheets/d/{your-google-sheet-id}/edit?usp=sharing';
                  const sheet_name = 'cumulation';
                  const SpreadSheet = SpreadsheetApp.openByUrl(sheet_url);
                  const reserve_list = SpreadSheet.getSheetByName(sheet_name);
              
                  const sheet_name_2 = 'record';
                  const SpreadSheet_record = SpreadsheetApp.openByUrl(sheet_url);
                  const record_list = SpreadSheet_record.getSheetByName(sheet_name_2);
              
              
                  // Declare necessary parameters
                  var current_hour = Utilities.formatDate(new Date(), "Asia/Taipei", "HH"); // Get the current time
                  var current_list_row = reserve_list.getLastRow(); // Get the last row of the sheet
                  var reply_message = []; // Blank reply message array, JSON will be added later
              
                  // Query the LINE account name of the sender
                  function get_user_name() {
                      // Determine if it's a group member or a single user
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
                          // Call LINE User Info API to get the username associated with the user ID
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
                          reserve_name = "not available";
                      }
                      return String(reserve_name)
                  }
              
                  // Send a message back to LINE and to the user
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
              
                  // Convert the input value word to LINE text message format in JSON
                  function format_text_message(word) {
                      let text_json = [{
                          "type": "text",
                          "text": word
                      }]
              
                      return text_json;
                  }
              
                  function getRewardPhrase(timeObject, level) {
                      // Get seconds
                      var seconds = timeObject.getSeconds();
              
                      // Divide the seconds by 10 and get the remainder
                      var remainder = seconds % 15;
              
                      // Define different reward phrases based on the remainder
                      if (level == 1) {
                          // Achieved goal
                          var rewardPhrases = [
                              "Great job!",
                              "Everyone can see your effort!",
                              "Awesome! How did you do it~",
                              "Impressive",
                              "Nice! Keep it up~",
                              "You've really been working out seriously, you deserve applause!",
                              "You did it! Keep pushing towards higher goals!",
                              "Every step is progress, be proud of yourself!",
                              "You're working hard, awesome!",
                              "Persistence is victory! Keep going!",
                              "This pace is impressive, the future is bright!",
                              "Step by step, everyone can see your progress!",
                              "Well done! Success always belongs to those who are prepared!",
                              "This is what persistence looks like, great job!",
                              "Every moment of persistence is worth praising!"
                          ];
                      } else {
                          // Exceeded goal
                          var rewardPhrases = [
                              "Amazing! Five stars for you!",
                              "Everyone can see your effort!",
                              "Awesome! Want to share your secrets of persistence~",
                              "Impressive, top-notch performance!",
                              "Great job! Wishing you all the best!",
                              "You've surpassed yourself, truly admirable!",
                              "Breaking limits, this is true strength!",
                              "You're shining today!",
                              "No doubt, you're a fitness master, keep it up!",
                              "Such performance, I can only say: astonishing!",
                              "Wow! This isn't just hard work, it's extraordinary perseverance!",
                              "Today, you've truly pushed the limits to new heights!",
                              "Invincible! Your performance makes me look at you with new respect!",
                              "In the world of the strong, I can only say: respect!",
                              "Superb, you're worth learning from!"
                          ];
                      }
              
                      // Return the corresponding reward phrase based on the remainder
                      var rewardPhrase = rewardPhrases[remainder];
                      return rewardPhrase;
                  }
              
                  var reserve_name = get_user_name();
              
                  if (typeof replyToken === 'undefined') {
                      return;
                  };
              
              
                  function calculateWeeklyActivity(member_name, startDate, endDate) {
                      var totalMinutes = 0;
                      var recordedDays = new Set(); // Use a set to store recorded dates, ensuring uniqueness
              
                      // Get all records
                      var allRecords = record_list.getRange(1, 1, record_list.getLastRow(), 3).getValues();
              
                      // Iterate through records
                      allRecords.forEach(function(record) {
                          var recordDate = new Date(record[0]);
                          var member = record[1];
                          var minutes = record[2];
                          var oriDate = record[3]; // Assuming this is the 4th column data
              
                          // Check if the record meets the conditions
                          if (member === member_name && recordDate >= startDate && recordDate <= endDate && minutes > 0 && oriDate !== '') {
                              totalMinutes += minutes; // Accumulate exercise minutes
                              recordedDays.add(recordDate.toDateString()); // Add the date to the set
                          }
                      });
              
                      return {
                          totalDays: recordedDays.size, // Use the size of the set as the total number of days
                          totalMinutes: totalMinutes
                      };
                  }
              
                  // Extract the first and second lines from the message
                  var lines = userMessage.split('\n');
                  var firstLine = lines[0];
                  var secondLine = lines.length > 1 ? lines[1] : '';
                  var item = '';
              
                  // Check if the second line contains #, if so, treat the content after # as the exercise item
                  if (secondLine.startsWith('#')) {
                      item = secondLine.substring(1).trim();
                  }
              
                  // Check if the first line contains "+" and find the first "+"
                  var plusIndex = firstLine.indexOf("+");
                  // Check if the first line contains two "+", if so, find the second "+"
                  var secondPlusIndex = firstLine.indexOf("+", plusIndex + 1);
              
                  // If a "+" is found, extract the number after "+" as the minutes
                  if (plusIndex !== -1) {
                      // If the second "+" is found
                      if (secondPlusIndex !== -1) {
                          // Extract the number after the second "+" as the minutes
                          var minutes = parseInt(firstLine.substring(secondPlusIndex + 1));
                      } else {
                          // Extract the number after the first "+" as the minutes
                          var minutes = parseInt(firstLine.substring(plusIndex + 1));
                      }
                      // Get the current date and time
                      var currentDate = new Date();
                      var formattedDate = Utilities.formatDate(currentDate, "Asia/Taipei", "yyyy/MM/dd");
                      var currentDay = currentDate.getDay(); // Get the current day of the week, 0 means Sunday, 1 means Monday, and so on
                      
                      // Set the start date to Monday of the current week
                      var startDate = new Date(currentDate);
                      startDate.setDate(currentDate.getDate() - currentDay + (currentDay === 0 ? -6 : 1));
                      // Set the end date to Sunday of the current week
                      var endDate = new Date(currentDate);
                      endDate.setDate(currentDate.getDate() - currentDay + (currentDay === 0 ? 0 : 7)); // Set the end date to Sunday of the current week
              
                      // Set startDate to Monday at 00:00
                      startDate.setHours(0, 0, 0, 0);
              
                      // Set endDate to Sunday at 23:59
                      endDate.setHours(23, 59, 59, 999);
              
                      // Write the username, date, exercise minutes, and exercise item to the next row of Google Sheets
                      record_list.appendRow([formattedDate, reserve_name, minutes, currentDate, item]);        
              
                      // Calculate the total exercise time of the member for the week
                      var result = calculateWeeklyActivity(reserve_name, startDate, endDate);
              
                      reserve_list.appendRow([startDate, currentDate, reserve_name, result.totalDays, result.totalMinutes]);
              
                      // Reply: xx member has exercised xx minutes this week, this may cause anxiety, so let's remove it
                      // reply_message = format_text_message(reserve_name + " has exercised " + totalDays + " days and " + totalMinutes + " minutes this week");
              
                      // If the second "+" is found
                      if (secondPlusIndex !== -1) {
                          // If the record is "++", return the statistics
                          reply_message = reserve_name + " exercised " + result.totalDays + " days and " + result.totalMinutes + " minutes this week";
                      } else {
                          // Extract the number after the first "+" as the minutes
                          reply_message = reserve_name + " this week";
                      }
              
                      // If totalDays >= 6 and totalMinutes >= 120, set the reply message to exceeded goal message
                      if (result.totalDays >= 6 && result.totalMinutes >= 120 && minutes > 0) {
                          reply_message += " exceeded the goal, " + getRewardPhrase(currentDate, 2);
                      } else if (result.totalDays >= 3 && result.totalMinutes >= 60 && minutes > 0) {
                          // If totalDays >= 3 and totalMinutes >= 60, set the reply message to achieved goal message
                          reply_message += " achieved the goal, " + getRewardPhrase(currentDate, 1);
                      }
              
                      // Only send the reply message if it is not "[Name] this week"
                      if (reply_message.trim() !== reserve_name + " this week") {
                          send_to_line(format_text_message(reply_message));
                      }
                  }
                  // Other non-keyword messages are ignored (to avoid disturbing the group chat)
                  else {
                      console.log("else here, nothing will happen.")
                  }
              }
              