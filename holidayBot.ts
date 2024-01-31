import { App } from "@slack/bolt";
import dotenv from "dotenv";
import axios from "axios";
import * as ical from "node-ical";

async function parseICSData(
   url: string, dateToCheck: Date
): Promise<string[]> {
  try {
    // Replace 'webcal' with 'http'
    url = url.replace("webcal", "http");

    const response = await axios.get(url);
    const data = response.data;
    const calendarData = ical.parseICS(data);
    const onVacationOrWorking: string[] = []; // Array to store summary of who is on holiday and (not on vacation)all other people the loop scans through


    // Function to check if two dates are the same
    function isSameDate(date1: Date, date2: Date): boolean {
      return date1.toISOString() === date2.toISOString();
    }
    // Loop through vacationInfo to find every object with VEVENT type and matching start date
    for (const dataId in calendarData) {
      if (calendarData.hasOwnProperty(dataId)) {
        const vacationInfo = calendarData[dataId];

        if (
          vacationInfo.type === "VEVENT" &&
          isSameDate(vacationInfo.start, dateToCheck)
        ) {
          // Check if the start date matches dateToCheck

          onVacationOrWorking.push(vacationInfo.summary); // store loop results in an array
        } else {
          onVacationOrWorking.push("not on vacation today"); // store loop results in an array
        }
      }
    }

    console.log(onVacationOrWorking);
    return onVacationOrWorking; //return the array from the loop above
  } catch (error) {
    console.error(error);
    return [];
  }
}







// An async function used to post messages to the bot based on set conditions
(async () => {
  // the Icalendar URL
  const url: string =
    "webcal://app.timeoff.management/feed/ad4c2427-f2ec-45b5-b91b-2759a2dc1dbc/ical.ics"; 

  // Created a new date to check to compare with that of the calendar data holiday start date
  const dateToCheck: Date = new Date(); 

  try {
    const arrayOfOnVacationOrWorking = await parseICSData(
       url,  dateToCheck
    ); // Call the parseICSData function to get an array of all the people on vacation or working
    let everyOneIsWorking: boolean = true; // Boolean to check if all items in onVacationOrWorking is "not on vacation today"
    const staffsOnVacation: string[] = []; // Array to store the names of all the people on vacation


    // Loop through the array of onVacationOrWorking to check if there are items that are "not on vacation today" 
    //and push them onto the staffsOnVacation array
    for (const item of arrayOfOnVacationOrWorking) {
      if (item !== "not on vacation today") {
        everyOneIsWorking = false; // Set everyOneIsWorking to false if there are items that are not "not on vacation today"
        staffsOnVacation.push(item);
        
      }
    } 
    console.log(staffsOnVacation);

// If everyOneIsWorking is true, then send a message to the bot saying everyone is working based on the conditions below 
//as well as other messages set below. for staffs that work specific hours and days
    if (everyOneIsWorking) {
      let noVacationMessage: string = "Everyone is due in work today."; // Set the message to send to the bot if everyone is working
      let customNoVacationMessage: string = "There is no one on holiday today."; // Set the custom message to send to the bot if no one is holiday but some staffs aren't working that day

      if (dateToCheck.getDay() === 1) { // Check if today is Monday
        dotenv.config();
        //creating an instance of the app
        const app: App = new App({
          signingSecret: process.env.SLACK_SIGNING_SECRET,
          token: process.env.SLACK_BOT_TOKEN,
        });

        interface Element {
          type: string;
          [key: string]: any;
        }

        interface Block {
          type: string;
          elements?: Element[];
          text?: {
            type: string;
            text: string;
          };
          [key: string]: any;
        }

        const blocks: Block[] = [
          {
            type: "rich_text",
            elements: [
              {
                type: "rich_text_section",
                elements: [
                  {
                    type: "emoji",
                    name: "palm_tree",
                    unicode: "1f334",
                  },
                  {
                    type: "text",
                    text:
                      "  Daily Vacation Update - " +
                      noVacationMessage +
                      " Marley Dabb is working 9am to 1pm and Moritz Cornielje is working 7am to 11am then 4pm to 7pm.",
                  },
                ],
              },
            ],
          },
        ];

        //function to post message to slack
        async function postMessage() {
          await app.client.chat.postMessage({
            token: process.env.SLACK_BOT_TOKEN,
            channel: process.env.SLACK_CHANNEL as string,
            text: "Hi, I am a Vacation Bot!",
            blocks,
          });
        }

        // Calling the function and posting the message
        postMessage();
      } //else if (dateToCheck.getDay() === 2) {}     No one has special working hours on tuesday.
      else if (dateToCheck.getDay() === 3) {  // Check if today is Wednesday
        dotenv.config(); 
        //creating an instance of the app
        const app: App = new App({
          signingSecret: process.env.SLACK_SIGNING_SECRET,
          token: process.env.SLACK_BOT_TOKEN,
        });

        interface Element {
          type: string;
          [key: string]: any;
        }

        interface Block {
          type: string;
          elements?: Element[];
          text?: {
            type: string;
            text: string;
          };
          [key: string]: any;
        }

        const blocks: Block[] = [
          {
            type: "rich_text",
            elements: [
              {
                type: "rich_text_section",
                elements: [
                  {
                    type: "emoji",
                    name: "palm_tree",
                    unicode: "1f334",
                  },
                  {
                    type: "text",
                    text:
                      "  Daily Vacation Update - " +
                      noVacationMessage +
                      " Moritz Cornielje is working 1pm to 7pm.",
                  },
                ],
              },
            ],
          },
        ];

        //function to post message to slack
        async function postMessage() {
          await app.client.chat.postMessage({
            token: process.env.SLACK_BOT_TOKEN,
            channel: process.env.SLACK_CHANNEL as string,
            text: "Hi, I am a Vacation Bot!",
            blocks,
          });
        }

        // Calling the function and posting the message
        postMessage();
      } else if (dateToCheck.getDay() === 4) { // Check if today is Thursday
        dotenv.config();
        //creating an instance of the app
        const app: App = new App({
          signingSecret: process.env.SLACK_SIGNING_SECRET,
          token: process.env.SLACK_BOT_TOKEN,
        });

        interface Element {
          type: string;
          [key: string]: any;
        }

        interface Block {
          type: string;
          elements?: Element[];
          text?: {
            type: string;
            text: string;
          };
          [key: string]: any;
        }

        const blocks: Block[] = [
          {
            type: "rich_text",
            elements: [
              {
                type: "rich_text_section",
                elements: [
                  {
                    type: "emoji",
                    name: "palm_tree",
                    unicode: "1f334",
                  },
                  {
                    type: "text",
                    text:
                      "  Daily Vacation Update - " +
                      customNoVacationMessage +
                      " Marley Dabb does not work today.",
                  },
                ],
              },
            ],
          },
        ];

        //function to post message to slack
        async function postMessage() {
          await app.client.chat.postMessage({
            token: process.env.SLACK_BOT_TOKEN,
            channel: process.env.SLACK_CHANNEL as string,
            text: "Hi, I am a Vacation Bot!",
            blocks,
          });
        }

        // Calling the function and posting the message
        postMessage();
      } else if (dateToCheck.getDay() === 5) { // Check if today is Friday
        dotenv.config();
        //creating an instance of the app
        const app: App = new App({
          signingSecret: process.env.SLACK_SIGNING_SECRET,
          token: process.env.SLACK_BOT_TOKEN,
        });

        interface Element {
          type: string;
          [key: string]: any;
        }

        interface Block {
          type: string;
          elements?: Element[];
          text?: {
            type: string;
            text: string;
          };
          [key: string]: any;
        }

        const blocks: Block[] = [
          {
            type: "rich_text",
            elements: [
              {
                type: "rich_text_section",
                elements: [
                  {
                    type: "emoji",
                    name: "palm_tree",
                    unicode: "1f334",
                  },
                  {
                    type: "text",
                    text:
                      "  Daily Vacation Update - " +
                      customNoVacationMessage +
                      " Moritz Cornielje does not work today.",
                  },
                ],
              },
            ],
          },
        ];

        //function to post message to slack
        async function postMessage() {
          await app.client.chat.postMessage({
            token: process.env.SLACK_BOT_TOKEN,
            channel: process.env.SLACK_CHANNEL as string,
            text: "Hi, I am a Vacation Bot!",
            blocks,
          });
        }

        // Calling the function and posting the message
        postMessage();
      } else { // post everyone is due in work today
        dotenv.config();
        //creating an instance of the app
        const app: App = new App({
          signingSecret: process.env.SLACK_SIGNING_SECRET,
          token: process.env.SLACK_BOT_TOKEN,
        });

        interface Element {
          type: string;
          [key: string]: any;
        }

        interface Block {
          type: string;
          elements?: Element[];
          text?: {
            type: string;
            text: string;
          };
          [key: string]: any;
        }

        const blocks: Block[] = [
          {
            type: "rich_text",
            elements: [
              {
                type: "rich_text_section",
                elements: [
                  {
                    type: "emoji",
                    name: "palm_tree",
                    unicode: "1f334",
                  },
                  {
                    type: "text",
                    text: "  Daily Vacation Update - " + noVacationMessage,
                  },
                ],
              },
            ],
          },
        ];

        //function to post message to slack
        async function postMessage() {
          await app.client.chat.postMessage({
            token: process.env.SLACK_BOT_TOKEN,
            channel: process.env.SLACK_CHANNEL as string,
            text: "Hi, I am a Vacation Bot!",
            blocks,
          });
        }

        // Calling the function and posting the message
        postMessage();
      }




    } else { // else if some staffs are on holiday today
      
      if (staffsOnVacation.length > 1) { //check if more than one person is on vacation
        const namesOfStaffsOnVacation = staffsOnVacation.map(
          (entry) => entry.split(" is ")[0]
        ); // split the string at the word "is" and take the first part of the string and store names of the staffs on vacation in an array;
        const vacationMessage =
          namesOfStaffsOnVacation.slice(0, -1).join(", ") +
          " and " +
          namesOfStaffsOnVacation.slice(-1) +
          " are on vacation today."; // combine the names of the people on vacation and join them with a comma;

        if (dateToCheck.getDay() === 1) { // Check if today is Monday
          if (namesOfStaffsOnVacation.includes("Marley Dabb")) { // check if Marley Dabb is on vacation on monday
            dotenv.config();
            //creating an instance of the app
            const app: App = new App({
              signingSecret: process.env.SLACK_SIGNING_SECRET,
              token: process.env.SLACK_BOT_TOKEN,
            });

            interface Element {
              type: string;
              [key: string]: any;
            }

            interface Block {
              type: string;
              elements?: Element[];
              text?: {
                type: string;
                text: string;
              };
              [key: string]: any;
            }

            const blocks: Block[] = [
              {
                type: "rich_text",
                elements: [
                  {
                    type: "rich_text_section",
                    elements: [
                      {
                        type: "emoji",
                        name: "palm_tree",
                        unicode: "1f334",
                      },
                      {
                        type: "text",
                        text:
                          "  Daily Vacation Update - " +
                          vacationMessage +
                          " Moritz Cornielje is working 7am to 11am then 4pm to 7pm.",
                      },
                    ],
                  },
                ],
              },
            ];

            //function to post message to slack
            async function postMessage() {
              await app.client.chat.postMessage({
                token: process.env.SLACK_BOT_TOKEN,
                channel: process.env.SLACK_CHANNEL as string,
                text: "Hi, I am a Vacation Bot!",
                blocks,
              });
            }

            // Calling the function and posting the message
            postMessage();
          } else if (namesOfStaffsOnVacation.includes("Moritz Cornielje")) { // check if Moritz Cornielje is on vacation on monday
            dotenv.config();
            //creating an instance of the app
            const app: App = new App({
              signingSecret: process.env.SLACK_SIGNING_SECRET,
              token: process.env.SLACK_BOT_TOKEN,
            });

            interface Element {
              type: string;
              [key: string]: any;
            }

            interface Block {
              type: string;
              elements?: Element[];
              text?: {
                type: string;
                text: string;
              };
              [key: string]: any;
            }

            const blocks: Block[] = [
              {
                type: "rich_text",
                elements: [
                  {
                    type: "rich_text_section",
                    elements: [
                      {
                        type: "emoji",
                        name: "palm_tree",
                        unicode: "1f334",
                      },
                      {
                        type: "text",
                        text:
                          "  Daily Vacation Update - " +
                          vacationMessage +
                          " Marley Dabb is working 9am to 1pm.",
                      },
                    ],
                  },
                ],
              },
            ];

            //function to post message to slack
            async function postMessage() {
              await app.client.chat.postMessage({
                token: process.env.SLACK_BOT_TOKEN,
                channel: process.env.SLACK_CHANNEL as string,
                text: "Hi, I am a Vacation Bot!",
                blocks,
              });
            }

            // Calling the function and posting the message
            postMessage();
          } else if (
            namesOfStaffsOnVacation.includes("Marley Dabb") &&
            namesOfStaffsOnVacation.includes("Moritz Cornielje")
          ) { // Check if Marley Dabb and Moritz Cornielje are on vacation on Monday
            dotenv.config();
            //creating an instance of the app
            const app: App = new App({
              signingSecret: process.env.SLACK_SIGNING_SECRET,
              token: process.env.SLACK_BOT_TOKEN,
            });

            interface Element {
              type: string;
              [key: string]: any;
            }

            interface Block {
              type: string;
              elements?: Element[];
              text?: {
                type: string;
                text: string;
              };
              [key: string]: any;
            }

            const blocks: Block[] = [
              {
                type: "rich_text",
                elements: [
                  {
                    type: "rich_text_section",
                    elements: [
                      {
                        type: "emoji",
                        name: "palm_tree",
                        unicode: "1f334",
                      },
                      {
                        type: "text",
                        text: "  Daily Vacation Update - " + vacationMessage,
                      },
                    ],
                  },
                ],
              },
            ];

            //function to post message to slack
            async function postMessage() {
              await app.client.chat.postMessage({
                token: process.env.SLACK_BOT_TOKEN,
                channel: process.env.SLACK_CHANNEL as string,
                text: "Hi, I am a Vacation Bot!",
                blocks,
              });
            }

            // Calling the function and posting the message
            postMessage();
          } else { // post message to slack if marley dabb and moritz cornielje are not on vacation on monday
            dotenv.config();
            //creating an instance of the app
            const app: App = new App({
              signingSecret: process.env.SLACK_SIGNING_SECRET,
              token: process.env.SLACK_BOT_TOKEN,
            });

            interface Element {
              type: string;
              [key: string]: any;
            }

            interface Block {
              type: string;
              elements?: Element[];
              text?: {
                type: string;
                text: string;
              };
              [key: string]: any;
            }

            const blocks: Block[] = [
              {
                type: "rich_text",
                elements: [
                  {
                    type: "rich_text_section",
                    elements: [
                      {
                        type: "emoji",
                        name: "palm_tree",
                        unicode: "1f334",
                      },
                      {
                        type: "text",
                        text:
                          "  Daily Vacation Update - " +
                          vacationMessage +
                          " Marley Dabb is working 9am to 1pm and Moritz Cornielje is working 7am to 11am then 4pm to 7pm.",
                      },
                    ],
                  },
                ],
              },
            ];

            //function to post message to slack
            async function postMessage() {
              await app.client.chat.postMessage({
                token: process.env.SLACK_BOT_TOKEN,
                channel: process.env.SLACK_CHANNEL as string,
                text: "Hi, I am a Vacation Bot!",
                blocks,
              });
            }

            // Calling the function and posting the message
            postMessage();
          }
        } //else if (dateToCheck.getDay() === 2) {}     No one has special working hours on tuesday.
        else if (dateToCheck.getDay() === 3) { // check if today is Wednesday
          if (namesOfStaffsOnVacation.includes("Moritz Cornielje")) { // check if Moritz Cornielje is on vacation on wednesday
            dotenv.config();
            //creating an instance of the app
            const app: App = new App({
              signingSecret: process.env.SLACK_SIGNING_SECRET,
              token: process.env.SLACK_BOT_TOKEN,
            });

            interface Element {
              type: string;
              [key: string]: any;
            }

            interface Block {
              type: string;
              elements?: Element[];
              text?: {
                type: string;
                text: string;
              };
              [key: string]: any;
            }

            const blocks: Block[] = [
              {
                type: "rich_text",
                elements: [
                  {
                    type: "rich_text_section",
                    elements: [
                      {
                        type: "emoji",
                        name: "palm_tree",
                        unicode: "1f334",
                      },
                      {
                        type: "text",
                        text: "  Daily Vacation Update - " + vacationMessage,
                      },
                    ],
                  },
                ],
              },
            ];

            //function to post message to slack
            async function postMessage() {
              await app.client.chat.postMessage({
                token: process.env.SLACK_BOT_TOKEN,
                channel: process.env.SLACK_CHANNEL as string,
                text: "Hi, I am a Vacation Bot!",
                blocks,
              });
            }

            // Calling the function and posting the message
            postMessage();
          } else { // else if Moritz Cornielje is not on vacation on Wednesday
            dotenv.config();
            //creating an instance of the app
            const app: App = new App({
              signingSecret: process.env.SLACK_SIGNING_SECRET,
              token: process.env.SLACK_BOT_TOKEN,
            });

            interface Element {
              type: string;
              [key: string]: any;
            }

            interface Block {
              type: string;
              elements?: Element[];
              text?: {
                type: string;
                text: string;
              };
              [key: string]: any;
            }

            const blocks: Block[] = [
              {
                type: "rich_text",
                elements: [
                  {
                    type: "rich_text_section",
                    elements: [
                      {
                        type: "emoji",
                        name: "palm_tree",
                        unicode: "1f334",
                      },
                      {
                        type: "text",
                        text:
                          "  Daily Vacation Update - " +
                          vacationMessage +
                          " Moritz Cornielje is working 1pm to 7pm.",
                      },
                    ],
                  },
                ],
              },
            ];

            //function to post message to slack
            async function postMessage() {
              await app.client.chat.postMessage({
                token: process.env.SLACK_BOT_TOKEN,
                channel: process.env.SLACK_CHANNEL as string,
                text: "Hi, I am a Vacation Bot!",
                blocks,
              });
            }

            // Calling the function and posting the message
            postMessage();
          }
        } else if (dateToCheck.getDay() === 4) { // check if today is Thursday
          if (namesOfStaffsOnVacation.includes("Marley Dabb")) { // Check if Marley Dabb is on vacation on Thursday
            dotenv.config();
            //creating an instance of the app
            const app: App = new App({
              signingSecret: process.env.SLACK_SIGNING_SECRET,
              token: process.env.SLACK_BOT_TOKEN,
            });

            interface Element {
              type: string;
              [key: string]: any;
            }

            interface Block {
              type: string;
              elements?: Element[];
              text?: {
                type: string;
                text: string;
              };
              [key: string]: any;
            }

            const blocks: Block[] = [
              {
                type: "rich_text",
                elements: [
                  {
                    type: "rich_text_section",
                    elements: [
                      {
                        type: "emoji",
                        name: "palm_tree",
                        unicode: "1f334",
                      },
                      {
                        type: "text",
                        text: "  Daily Vacation Update - " + vacationMessage,
                      },
                    ],
                  },
                ],
              },
            ];

            //function to post message to slack
            async function postMessage() {
              await app.client.chat.postMessage({
                token: process.env.SLACK_BOT_TOKEN,
                channel: process.env.SLACK_CHANNEL as string,
                text: "Hi, I am a Vacation Bot!",
                blocks,
              });
            }

            // Calling the function and posting the message
            postMessage();
          } else { // else if Moritz Cornielje is not on vacation on Thursday
            dotenv.config();
            //creating an instance of the app
            const app: App = new App({
              signingSecret: process.env.SLACK_SIGNING_SECRET,
              token: process.env.SLACK_BOT_TOKEN,
            });

            interface Element {
              type: string;
              [key: string]: any;
            }

            interface Block {
              type: string;
              elements?: Element[];
              text?: {
                type: string;
                text: string;
              };
              [key: string]: any;
            }

            const blocks: Block[] = [
              {
                type: "rich_text",
                elements: [
                  {
                    type: "rich_text_section",
                    elements: [
                      {
                        type: "emoji",
                        name: "palm_tree",
                        unicode: "1f334",
                      },
                      {
                        type: "text",
                        text:
                          "  Daily Vacation Update - " +
                          vacationMessage +
                          " Marley Dabb does not work today.",
                      },
                    ],
                  },
                ],
              },
            ];

            //function to post message to slack
            async function postMessage() {
              await app.client.chat.postMessage({
                token: process.env.SLACK_BOT_TOKEN,
                channel: process.env.SLACK_CHANNEL as string,
                text: "Hi, I am a Vacation Bot!",
                blocks,
              });
            }

            // Calling the function and posting the message
            postMessage();
          }
        } else if (dateToCheck.getDay() === 5) { // check if today is Friday
          if (namesOfStaffsOnVacation.includes("Moritz Cornielje")) { // check if Moritz Cornielje is on vacation on Friday
            dotenv.config();
            //creating an instance of the app
            const app: App = new App({
              signingSecret: process.env.SLACK_SIGNING_SECRET,
              token: process.env.SLACK_BOT_TOKEN,
            });

            interface Element {
              type: string;
              [key: string]: any;
            }

            interface Block {
              type: string;
              elements?: Element[];
              text?: {
                type: string;
                text: string;
              };
              [key: string]: any;
            }

            const blocks: Block[] = [
              {
                type: "rich_text",
                elements: [
                  {
                    type: "rich_text_section",
                    elements: [
                      {
                        type: "emoji",
                        name: "palm_tree",
                        unicode: "1f334",
                      },
                      {
                        type: "text",
                        text: "  Daily Vacation Update - " + vacationMessage,
                      },
                    ],
                  },
                ],
              },
            ];

            //function to post message to slack
            async function postMessage() {
              await app.client.chat.postMessage({
                token: process.env.SLACK_BOT_TOKEN,
                channel: process.env.SLACK_CHANNEL as string,
                text: "Hi, I am a Vacation Bot!",
                blocks,
              });
            }

            // Calling the function and posting the message
            postMessage();
          } else { // else if Moritz Cornielje is not on vacation on Friday
            dotenv.config();
            //creating an instance of the app
            const app: App = new App({
              signingSecret: process.env.SLACK_SIGNING_SECRET,
              token: process.env.SLACK_BOT_TOKEN,
            });

            interface Element {
              type: string;
              [key: string]: any;
            }

            interface Block {
              type: string;
              elements?: Element[];
              text?: {
                type: string;
                text: string;
              };
              [key: string]: any;
            }

            const blocks: Block[] = [
              {
                type: "rich_text",
                elements: [
                  {
                    type: "rich_text_section",
                    elements: [
                      {
                        type: "emoji",
                        name: "palm_tree",
                        unicode: "1f334",
                      },
                      {
                        type: "text",
                        text:
                          "  Daily Vacation Update - " +
                          vacationMessage +
                          " Moritz Cornielje does not work today.",
                      },
                    ],
                  },
                ],
              },
            ];

            //function to post message to slack
            async function postMessage() {
              await app.client.chat.postMessage({
                token: process.env.SLACK_BOT_TOKEN,
                channel: process.env.SLACK_CHANNEL as string,
                text: "Hi, I am a Vacation Bot!",
                blocks,
              });
            }

            // Calling the function and posting the message
            postMessage();
          }
        } else { //else post names of staffs on vacation to slack
          dotenv.config();
          //creating an instance of the app
          const app: App = new App({
            signingSecret: process.env.SLACK_SIGNING_SECRET,
            token: process.env.SLACK_BOT_TOKEN,
          });

          interface Element {
            type: string;
            [key: string]: any;
          }

          interface Block {
            type: string;
            elements?: Element[];
            text?: {
              type: string;
              text: string;
            };
            [key: string]: any;
          }

          const blocks: Block[] = [
            {
              type: "rich_text",
              elements: [
                {
                  type: "rich_text_section",
                  elements: [
                    {
                      type: "emoji",
                      name: "palm_tree",
                      unicode: "1f334",
                    },
                    {
                      type: "text",
                      text: "  Daily Vacation Update - " + vacationMessage,
                    },
                  ],
                },
              ],
            },
          ];

          //function to post message to slack
          async function postMessage() {
            await app.client.chat.postMessage({
              token: process.env.SLACK_BOT_TOKEN,
              channel: process.env.SLACK_CHANNEL as string,
              text: "Hi, I am a Vacation Bot!",
              blocks,
            });
          }

          // Calling the function and posting the message
          postMessage();
        }






      } else { //when there is just one person on Vacation today
        
        const namesOfStaffsOnVacation = staffsOnVacation.map(
          (entry) => entry.split(" is ")[0]
        ); // split the string at the word "is" and take the first part of the string and store the name of the staff on vacation;
        const vacationMessage =
          namesOfStaffsOnVacation[0] + " is on vacation today."; // combine the name of the person on vacation and concatenate it with  "is on vacation today.";

        if (dateToCheck.getDay() === 1) { // check if today is Monday
          if (namesOfStaffsOnVacation.includes("Marley Dabb")) { // check if Marley Dabb is on vacation on Monday
            dotenv.config();
            //creating an instance of the app
            const app: App = new App({
              signingSecret: process.env.SLACK_SIGNING_SECRET,
              token: process.env.SLACK_BOT_TOKEN,
            });

            interface Element {
              type: string;
              [key: string]: any;
            }

            interface Block {
              type: string;
              elements?: Element[];
              text?: {
                type: string;
                text: string;
              };
              [key: string]: any;
            }

            const blocks: Block[] = [
              {
                type: "rich_text",
                elements: [
                  {
                    type: "rich_text_section",
                    elements: [
                      {
                        type: "emoji",
                        name: "palm_tree",
                        unicode: "1f334",
                      },
                      {
                        type: "text",
                        text:
                          "  Daily Vacation Update - " +
                          vacationMessage +
                          " Moritz Cornielje is working 7am to 11am then 4pm to 7pm.",
                      },
                    ],
                  },
                ],
              },
            ];

            //function to post message to slack
            async function postMessage() {
              await app.client.chat.postMessage({
                token: process.env.SLACK_BOT_TOKEN,
                channel: process.env.SLACK_CHANNEL as string,
                text: "Hi, I am a Vacation Bot!",
                blocks,
              });
            }

            // Calling the function and posting the message
            postMessage();
          } else if (namesOfStaffsOnVacation.includes("Moritz Cornielje")) { // check if Moritz Cornielje is on vacation on Monday
            dotenv.config();
            //creating an instance of the app
            const app: App = new App({
              signingSecret: process.env.SLACK_SIGNING_SECRET,
              token: process.env.SLACK_BOT_TOKEN,
            });

            interface Element {
              type: string;
              [key: string]: any;
            }

            interface Block {
              type: string;
              elements?: Element[];
              text?: {
                type: string;
                text: string;
              };
              [key: string]: any;
            }

            const blocks: Block[] = [
              {
                type: "rich_text",
                elements: [
                  {
                    type: "rich_text_section",
                    elements: [
                      {
                        type: "emoji",
                        name: "palm_tree",
                        unicode: "1f334",
                      },
                      {
                        type: "text",
                        text:
                          "  Daily Vacation Update - " +
                          vacationMessage +
                          " Marley Dabb is working 9am to 1pm.",
                      },
                    ],
                  },
                ],
              },
            ];

            //function to post message to slack
            async function postMessage() {
              await app.client.chat.postMessage({
                token: process.env.SLACK_BOT_TOKEN,
                channel: process.env.SLACK_CHANNEL as string,
                text: "Hi, I am a Vacation Bot!",
                blocks,
              });
            }

            // Calling the function and posting the message
            postMessage();
          } else { // else post names of staff on vacation to slack if one person is on  vacation but is not marley dabb or moritz cornielje.
            dotenv.config();
            //creating an instance of the app
            const app: App = new App({
              signingSecret: process.env.SLACK_SIGNING_SECRET,
              token: process.env.SLACK_BOT_TOKEN,
            });

            interface Element {
              type: string;
              [key: string]: any;
            }

            interface Block {
              type: string;
              elements?: Element[];
              text?: {
                type: string;
                text: string;
              };
              [key: string]: any;
            }

            const blocks: Block[] = [
              {
                type: "rich_text",
                elements: [
                  {
                    type: "rich_text_section",
                    elements: [
                      {
                        type: "emoji",
                        name: "palm_tree",
                        unicode: "1f334",
                      },
                      {
                        type: "text",
                        text:
                          "  Daily Vacation Update - " +
                          vacationMessage +
                          " Marley Dabb is working 9am to 1pm and Moritz Cornielje is working 7am to 11am then 4pm to 7pm.",
                      },
                    ],
                  },
                ],
              },
            ];

            //function to post message to slack
            async function postMessage() {
              await app.client.chat.postMessage({
                token: process.env.SLACK_BOT_TOKEN,
                channel: process.env.SLACK_CHANNEL as string,
                text: "Hi, I am a Vacation Bot!",
                blocks,
              });
            }

            // Calling the function and posting the message
            postMessage();
          }
        } //else if (dateToCheck.getDay() === 2) {}     No one has special working hours on tuesday.
        else if (dateToCheck.getDay() === 3) { // check if today is Wednesday
          if (namesOfStaffsOnVacation.includes("Moritz Cornielje")) { // check if Moritz Cornielje is on vacation on Wednesday
            dotenv.config();
            //creating an instance of the app
            const app: App = new App({
              signingSecret: process.env.SLACK_SIGNING_SECRET,
              token: process.env.SLACK_BOT_TOKEN,
            });

            interface Element {
              type: string;
              [key: string]: any;
            }

            interface Block {
              type: string;
              elements?: Element[];
              text?: {
                type: string;
                text: string;
              };
              [key: string]: any;
            }

            const blocks: Block[] = [
              {
                type: "rich_text",
                elements: [
                  {
                    type: "rich_text_section",
                    elements: [
                      {
                        type: "emoji",
                        name: "palm_tree",
                        unicode: "1f334",
                      },
                      {
                        type: "text",
                        text: "  Daily Vacation Update - " + vacationMessage,
                      },
                    ],
                  },
                ],
              },
            ];

            //function to post message to slack
            async function postMessage() {
              await app.client.chat.postMessage({
                token: process.env.SLACK_BOT_TOKEN,
                channel: process.env.SLACK_CHANNEL as string,
                text: "Hi, I am a Vacation Bot!",
                blocks,
              });
            }

            // Calling the function and posting the message
            postMessage();
          } else { // post message to the bot if one person is on vaacation as well as moritz working hours on wednesday
            dotenv.config();
            //creating an instance of the app
            const app: App = new App({
              signingSecret: process.env.SLACK_SIGNING_SECRET,
              token: process.env.SLACK_BOT_TOKEN,
            });

            interface Element {
              type: string;
              [key: string]: any;
            }

            interface Block {
              type: string;
              elements?: Element[];
              text?: {
                type: string;
                text: string;
              };
              [key: string]: any;
            }

            const blocks: Block[] = [
              {
                type: "rich_text",
                elements: [
                  {
                    type: "rich_text_section",
                    elements: [
                      {
                        type: "emoji",
                        name: "palm_tree",
                        unicode: "1f334",
                      },
                      {
                        type: "text",
                        text:
                          "  Daily Vacation Update - " +
                          vacationMessage +
                          " Moritz Cornielje is working 1pm to 7pm.",
                      },
                    ],
                  },
                ],
              },
            ];

            //function to post message to slack
            async function postMessage() {
              await app.client.chat.postMessage({
                token: process.env.SLACK_BOT_TOKEN,
                channel: process.env.SLACK_CHANNEL as string,
                text: "Hi, I am a Vacation Bot!",
                blocks,
              });
            }

            // Calling the function and posting the message
            postMessage();
          }
        } else if (dateToCheck.getDay() === 4) { // check if today is Thursday
          if (namesOfStaffsOnVacation.includes("Marley Dabb")) { // check if Marley Dabb is on vacation on Thursday
            dotenv.config();
            //creating an instance of the app
            const app: App = new App({
              signingSecret: process.env.SLACK_SIGNING_SECRET,
              token: process.env.SLACK_BOT_TOKEN,
            });

            interface Element {
              type: string;
              [key: string]: any;
            }

            interface Block {
              type: string;
              elements?: Element[];
              text?: {
                type: string;
                text: string;
              };
              [key: string]: any;
            }

            const blocks: Block[] = [
              {
                type: "rich_text",
                elements: [
                  {
                    type: "rich_text_section",
                    elements: [
                      {
                        type: "emoji",
                        name: "palm_tree",
                        unicode: "1f334",
                      },
                      {
                        type: "text",
                        text: "  Daily Vacation Update - " + vacationMessage,
                      },
                    ],
                  },
                ],
              },
            ];

            //function to post message to slack
            async function postMessage() {
              await app.client.chat.postMessage({
                token: process.env.SLACK_BOT_TOKEN,
                channel: process.env.SLACK_CHANNEL as string,
                text: "Hi, I am a Vacation Bot!",
                blocks,
              });
            }

            // Calling the function and posting the message
            postMessage();
          } else { // else if Marley Dabb is not on vacation on Thursday
            dotenv.config();
            //creating an instance of the app
            const app: App = new App({
              signingSecret: process.env.SLACK_SIGNING_SECRET,
              token: process.env.SLACK_BOT_TOKEN,
            });

            interface Element {
              type: string;
              [key: string]: any;
            }

            interface Block {
              type: string;
              elements?: Element[];
              text?: {
                type: string;
                text: string;
              };
              [key: string]: any;
            }

            const blocks: Block[] = [
              {
                type: "rich_text",
                elements: [
                  {
                    type: "rich_text_section",
                    elements: [
                      {
                        type: "emoji",
                        name: "palm_tree",
                        unicode: "1f334",
                      },
                      {
                        type: "text",
                        text:
                          "  Daily Vacation Update - " +
                          vacationMessage +
                          " Marley Dabb does not work today.",
                      },
                    ],
                  },
                ],
              },
            ];

            //function to post message to slack
            async function postMessage() {
              await app.client.chat.postMessage({
                token: process.env.SLACK_BOT_TOKEN,
                channel: process.env.SLACK_CHANNEL as string,
                text: "Hi, I am a Vacation Bot!",
                blocks,
              });
            }

            // Calling the function and posting the message
            postMessage();
          }
        } else if (dateToCheck.getDay() === 5) { // check if today is Friday
          if (namesOfStaffsOnVacation.includes("Moritz Cornielje")) { // check if Moritz Cornielje is on vacation on Friday
            dotenv.config();
            //creating an instance of the app
            const app: App = new App({
              signingSecret: process.env.SLACK_SIGNING_SECRET,
              token: process.env.SLACK_BOT_TOKEN,
            });

            interface Element {
              type: string;
              [key: string]: any;
            }

            interface Block {
              type: string;
              elements?: Element[];
              text?: {
                type: string;
                text: string;
              };
              [key: string]: any;
            }

            const blocks: Block[] = [
              {
                type: "rich_text",
                elements: [
                  {
                    type: "rich_text_section",
                    elements: [
                      {
                        type: "emoji",
                        name: "palm_tree",
                        unicode: "1f334",
                      },
                      {
                        type: "text",
                        text: "  Daily Vacation Update - " + vacationMessage,
                      },
                    ],
                  },
                ],
              },
            ];

            //function to post message to slack
            async function postMessage() {
              await app.client.chat.postMessage({
                token: process.env.SLACK_BOT_TOKEN,
                channel: process.env.SLACK_CHANNEL as string,
                text: "Hi, I am a Vacation Bot!",
                blocks,
              });
            }

            // Calling the function and posting the message
            postMessage();
          } else { // else if Moritz Cornielje is not on vacation on Friday post  who is on vacation and a message saying Moritz Cornielje is not working today
            dotenv.config();
            //creating an instance of the app
            const app: App = new App({
              signingSecret: process.env.SLACK_SIGNING_SECRET,
              token: process.env.SLACK_BOT_TOKEN,
            });

            interface Element {
              type: string;
              [key: string]: any;
            }

            interface Block {
              type: string;
              elements?: Element[];
              text?: {
                type: string;
                text: string;
              };
              [key: string]: any;
            }

            const blocks: Block[] = [
              {
                type: "rich_text",
                elements: [
                  {
                    type: "rich_text_section",
                    elements: [
                      {
                        type: "emoji",
                        name: "palm_tree",
                        unicode: "1f334",
                      },
                      {
                        type: "text",
                        text:
                          "  Daily Vacation Update - " +
                          vacationMessage +
                          " Moritz Cornielje does not work today.",
                      },
                    ],
                  },
                ],
              },
            ];

            //function to post message to slack
            async function postMessage() {
              await app.client.chat.postMessage({
                token: process.env.SLACK_BOT_TOKEN,
                channel: process.env.SLACK_CHANNEL as string,
                text: "Hi, I am a Vacation Bot!",
                blocks,
              });
            }

            // Calling the function and posting the message
            postMessage();
          }
        } else { // else just post the name of the person who is on vacation
          dotenv.config();
          //creating an instance of the app
          const app: App = new App({
            signingSecret: process.env.SLACK_SIGNING_SECRET,
            token: process.env.SLACK_BOT_TOKEN,
          });

          interface Element {
            type: string;
            [key: string]: any;
          }

          interface Block {
            type: string;
            elements?: Element[];
            text?: {
              type: string;
              text: string;
            };
            [key: string]: any;
          }

          const blocks: Block[] = [
            {
              type: "rich_text",
              elements: [
                {
                  type: "rich_text_section",
                  elements: [
                    {
                      type: "emoji",
                      name: "palm_tree",
                      unicode: "1f334",
                    },
                    {
                      type: "text",
                      text: "  Daily Vacation Update - " + vacationMessage,
                    },
                  ],
                },
              ],
            },
          ];

          //function to post message to slack
          async function postMessage() {
            await app.client.chat.postMessage({
              token: process.env.SLACK_BOT_TOKEN,
              channel: process.env.SLACK_CHANNEL as string,
              text: "Hi, I am a Vacation Bot!",
              blocks,
            });
          }

          // Calling the function and posting the message
          postMessage();
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
})();
