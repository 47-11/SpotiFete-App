import * as React from 'react';
import { Toast } from 'native-base';

export function noServerConnection(error) {
    Toast.show({
        text: 'No Server Connection',
        buttonText: 'Okay',
        duration: 3000
      })
}
