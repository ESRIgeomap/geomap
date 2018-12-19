import request from '../utils/request';

export default function loadJson() {
  return request('./config/fjLocation.json', {
    method: 'GET',
    handleAs: 'json',
  });
}
