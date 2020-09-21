<template>
    <v-card dark class="chatWindow">
        <v-card-title>
            {{ title }} chat
            <v-spacer></v-spacer>
            <!-- <v-btn icon>
                <v-icon>
                    mdi-close
                </v-icon>
            </v-btn> -->
        </v-card-title>
        <v-card-subtitle>
            Logged In:
            <template v-for="(user, i) in users">
                <span :key="i">
                    {{ user.username + ((i + 1 != users.length)? "," : "") }}
                </span>
            </template>
        </v-card-subtitle>
        <v-divider></v-divider>
        <v-card-text>
            <div class="messageWindow" ref="messageWindow">
                <template v-for="(message, i) in messages">
                    <v-row :key="i" class="messageRow">
                        <div class="avatarOuter">
                            <v-avatar v-if="!isClientUser(message.userID) && isLastMessageInChain(i)" class="avatar avatarOuter" size="30">
                                <img :src="message.avatarURL" :alt="message.username">
                            </v-avatar>
                        </div>

                        <!-- This User  -->
                        <div v-if="isClientUser(message.userID)" class="userMessageOuter clientUserMessageOuter">
                            <!-- Userstamp -->
                            <div v-if="isFirstMessageInChain(i)" class="username">{{ message.username }}</div>

                            <!-- Message body -->
                            <div class="clientUserMessage userMessage" @mouseenter="showTooltip(message, $event)" @mouseleave="hideTooltip()">
                                <b>{{ message.content }}</b>
                            </div>

                            <!-- Timestamp -->
                            <div v-if="isLastMessageInChain(i)" class="messageTimestamp">{{ formatTime(message.timestamp) }}<br><br></div>

                        </div>
                        <!-- Another User -->
                        <div v-else class="userMessageOuter">
                            <div v-if="isFirstMessageInChain(i)" class="username">{{ message.username }}</div>
                            <div class="otherUserMessage userMessage" @mouseenter="showTooltip(message, $event)" @mouseleave="hideTooltip()">
                                <b>{{ message.content }}</b>
                            </div>
                            <div v-if="isLastMessageInChain(i)" class="messageTimestamp">{{ formatTime(message.timestamp) }}<br><br></div>
                        </div>
                    </v-row>
                </template>
            </div>
            <div class="messageTextFieldOuter">
                <v-textarea
                    v-model="message"
                    auto-grow
                    filled
                    rounded
                    dense
                    :append-outer-icon="'mdi-send'"
                    clear-icon="mdi-close"
                    clearable
                    @click:append-outer="sendMessage"
                    @click:clear="clearMessage"
                    @keydown.enter="sendMessage"
                    rows="1"
                />
            </div>
        </v-card-text>
        <div v-show="shouldShowtooltip" ref="tooltip" class="tooltip">
            {{ tooltipTime }}
        </div>
    </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import {campaignStore} from "@/Stores/CampaignStore";
import {Message} from "@shared/Chat/Types";
import {serverProxy} from "@/Stores/ServerProxy";
import {Chat, CHAT_EVENT_NAME, CHAT_EVENT_TYPE} from "@shared/Chat/Chat"

interface UserData {
    username: string;
    userID: string;
}

export default Vue.extend({
    data: () => ({
        title: campaignStore.name,
        tooltipTime: null,
        shouldShowtooltip: false,
        message: null,
        userID: null,
        messages: null as Message[],
        users: [
            {
                username: "Arik",
                userID: "asudfy9asd6as",
            },
            // {
            //     username: "John",
            //     userID: "asdasiudyaisd",
            // },
            // {
            //     username: "Steve",
            //     userID: "iufhasdfhuadsf",
            // },
        ] as UserData[],
    }),
    methods: {
        isClientUser(userID: string) {
            return this.userID == userID;
        },
        isLastMessage(index: number) {
            return this.messages.length == index;
        },
        isFirstMessageInChain(index: number) {
            if (index == 0) return true;
            const isDifferentUser = this.messages[index].userID != this.messages[index - 1].userID;
            return !this.didOccurCloseTogether(index - 1, index) || isDifferentUser;
        },
        isLastMessageInChain(index: number) {
            if (index + 1 == this.messages.length) return true;
            const isDifferentUser = this.messages[index].userID != this.messages[index + 1].userID;
            return !this.didOccurCloseTogether(index, index + 1) || isDifferentUser;
        },
        didOccurCloseTogether(messageIndex1: number, messageIndex2: number) {
            const SECONDS_THRESHOLD = 60;
            const t1 = this.messages[messageIndex1].timestamp.getTime();
            const t2 = this.messages[messageIndex2].timestamp.getTime();
            const t3 = t2 - t1;
            return t3/1000 < SECONDS_THRESHOLD;
        },
        sendMessage() {
            const event: CHAT_EVENT_TYPE.SEND_MESSAGE = {
                content: this.message
            }
            serverProxy.emit(CHAT_EVENT_NAME.SEND_MESSAGE, event, (reply) => {
                console.log("Send Message Reply: ", reply);
            });
            console.log("Message: ", this.message);
            this.message = null;
        },
        clearMessage() {
            this.message = null;
        },
        showTooltip(message: Message, event: MouseEvent) {
            const tooltip = this.$refs.tooltip as HTMLElement;
            const srcElement = event.srcElement as HTMLElement;
            const srcRect = srcElement.getBoundingClientRect();
            // let tooltipRect = tooltip.getBoundingClientRect();

            tooltip.style.left = (srcRect.x)+'px';
            tooltip.style.top = (srcRect.y-44)+'px';
            this.tooltipTime = new Date(message.timestamp).toLocaleString();
            this.shouldShowtooltip = true;
        },
        hideTooltip() {
            this.shouldShowtooltip = false;
        },
        formatTime(timestamp: Date) {
            const SECOND_IN_MILLIS = 1000;
            const MINUTE_IN_MILLIS = SECOND_IN_MILLIS * 60;
            const HOUR_IN_MILLIS = MINUTE_IN_MILLIS * 60;
            const DAY_IN_MILLIS = HOUR_IN_MILLIS * 24;
            const WEEK_IN_MILLIS = DAY_IN_MILLIS * 7;
            const now = new Date();
            const t1 = timestamp.getTime();
            const t2 = now.getTime();
            const t3 = (t2 - t1);
            if (t3 < SECOND_IN_MILLIS) {
                return "Now"
            }
            else if (t3 < MINUTE_IN_MILLIS) {
                const seconds = Math.floor(t3/SECOND_IN_MILLIS);
                return `${seconds} seconds ago`;
            }
            else if (t3 < HOUR_IN_MILLIS) {
                const minutesPassed = Math.floor(t3/MINUTE_IN_MILLIS);
                return minutesPassed + " minutes ago";
            }
            else if (t3 < DAY_IN_MILLIS) {
                const withSeconds = timestamp.toLocaleTimeString();
                const timeArr = withSeconds.split(":");
                const amPm = timeArr[2].split(" ");
                const time = timeArr[0] + ":" + timeArr[1] + " " + amPm[1];
                return time;
            }
            else if (t3 < WEEK_IN_MILLIS) {
                const withSeconds = timestamp.toLocaleTimeString();
                const timeArr = withSeconds.split(":");
                const amPm = timeArr[2].split(" ");
                const time = timeArr[0] + ":" + timeArr[1] + " " + amPm[1];
                const withDate = timestamp.toUTCString();
                const dateArr = withDate.split(" ");
                const date = dateArr[0] + " " + dateArr[2] + " " + dateArr[1] + " at " + time;
                return date;
            }
            else {
                return timestamp.toUTCString();
            }
        }
    },
    mounted() {
        this.userID = this.$store.state.userID;
        console.log("Mounted Chat");
        serverProxy.addHandler(CHAT_EVENT_NAME.MESSAGE_RECIEVED, (reply: CHAT_EVENT_TYPE.MESSAGE_RECIEVED) => {
            const message = reply.message;
            message.timestamp = new Date(message.timestamp);
            this.messages.push(message)
            console.log("Message Recieved: ", reply);
        })
        const loadEvent: CHAT_EVENT_TYPE.LOAD_CHAT = {

        }
        serverProxy.emit(CHAT_EVENT_NAME.LOAD_CHAT, loadEvent, (messages: Chat.Message[]) => {
            console.log("Chat Loaded");
            messages.forEach(message => {
                message.timestamp = new Date(message.timestamp);
            });
            this.messages = messages;
            this.$nextTick(() => {
                const objDiv = this.$refs.messageWindow as HTMLElement;
                objDiv.scrollTop = objDiv.scrollHeight;
                console.log(objDiv.scrollTop)
            });
        });
    }
})
</script>
<style scoped>
    .chatWindow {
        /* max-width: 550px; */
        padding: 0px 0px 0px 10px;
    }
    .messageWindow {
        max-height: 300px;
        border: black solid 0px;
        overflow: scroll;
        overflow-x:hidden;
        padding-right: 15px;
        margin: 0px 8px 0px 0px;
    }
    .messageRow {
        margin: 0px 0px 2px 0px;
        position: relative;
    }
    .avatarOuter {
        width: 12%;
    }
    .avatar {
        position: absolute;
        bottom: 45px;
    }
    .clientUserMessageOuter {
        float: right;
        margin-left: auto;
        margin-right: 0
    }
    .clientUserMessage {
        background-color: midnightblue;
    }
    .otherUserMessage {
        background-color: rgb(54, 68, 68);
    }
    .userMessageOuter {
        width: 80%;
    }
    .userMessage {
        padding: 10px 10px 10px 12px;
        border-radius: 15px 15px 15px 0px;
    }
    .username {
        margin: 0px 0px 0px 10px;
    }
    .messageTimestamp {
        margin: 0px 0px 0px 10px;
    }
    .messageTextFieldOuter {
        margin: 10px 7px 0px 2px;
    }
    .tooltip {
        background-color: black;
        padding: 10px;
        position: fixed;
        z-index: 100;
        border-radius: 10px;
        opacity: 0.8;
    }
</style>