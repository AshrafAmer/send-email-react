import axios from 'axios';
import { JWT_URL } from './API';
const sendAPI = JWT_URL + '/emails/send';

export function sendEmails(from, to, subject, body) {
    return axios.post(sendAPI, {from, to, subject, body});
}
  