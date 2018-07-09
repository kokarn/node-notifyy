# Node-Notifyy

Module to send error messages to you on Telegram using [Notifyy-McNotifyFace](http://notifyy-mcnotifyface.herokuapp.com/).

## Installing

```zh
npm install node-notifyy --save
```

## Constructor options
`users`  
String or array with the tokens for the users we should notify.

`title`   
A default title for your messages.  
E.g `Application crashed` or `We've been overrun by sub-atomic monkeys!`

`exitAfterNotification`  
Default: `false`  
If we should exit the process after we've done the notification. Very blunt.    

`handleErrors`  
Default: `false`  
Enable this if you want to catch all errors globally and send notifications for them.  
Use with caution as this might intercept other error handlers in some situations.

## Methods

`send`  
Sends a notification.
### Available properties
Anything avaible for [Notifyy-McNotifyFace](https://github.com/kokarn/notifyy-mcnotifyface#available-parameters) with one addition.  

`exit`  
Default: Value of `exitAfterNotification`  
If we should exit after we've sent our telegram.


## Examples

Send a message

```javascript
const Notifyy = require( 'node-notifyy' );
let notifyy = new Notifyy( {
    users: '*TOKEN*'
} );

notifyy.send( {
    message: 'My message contents',
    title: 'My message title',
} );
```

Use as a notification for a single try/catch

```javascript
const Notifyy = require( 'node-notifyy' );
let notifyy = new Notifyy( {
    users: '*TOKEN*'
} );

try {
    undefinedMethod();
} catch ( error ) {
    notifyy.send( {
        message: error.message,
        code: error.stack,
    } );
}
```

With shorthand for standard errors

```javascript
const Notifyy = require( 'node-notifyy' );
let notifyy = new Notifyy({
    users: '*TOKEN*'
});

try {
    undefinedMethod();
} catch ( error ) {
    notifyy.send( error );
}
```

Use to catch all errors

```javascript
const Notifyy = require( 'node-notifyy' );
let notifyy = new Notifyy( {
    users: '*TOKEN*',
    handleErrors: true,
} );

undefinedMethod();
```
