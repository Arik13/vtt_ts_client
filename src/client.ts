exports.__esModule = true;

const CAMPAIGN_ID = "5ff57592a2f9d55bcc6b57b6";
const USER_ID = "5fe8d08b93cc51272c52cc44";

const Dispatcher = require("../src/Dispatcher/Dispatcher").default;

Dispatcher.join(CAMPAIGN_ID, USER_ID, (result: any) => {
    console.log(result);
});