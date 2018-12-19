import request from '../utils/request';

const addMapErrorBatchUsingPOST =
  'http://192.168.190.124/geoplatservice/maperror/addMapErrorBatch';

export function mapcorrectp(data) {
  const dataJson = JSON.stringify(data);
  return request(addMapErrorBatchUsingPOST, {
    method: 'POST',
    body: dataJson,
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    // dataType: 'json',
  });
}
