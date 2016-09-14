const https = require( 'https' );

class Notifyy {
    constructor ( options ) {
        if ( typeof options.users !== 'object' && typeof options.users !== 'string' ) {
            throw new Error( 'Missing users. At least one must be supplied' );
        }

        this.defaults = {
            exitAfterNotification: true,
            post: {
                headers: {
                    'Content-Type': 'application/json',
                },
                hostname: 'notifyy-mcnotifyface.herokuapp.com',
                method: 'POST',
                path: '/out',
                port: 443,
            },
        };

        this.options = Object.assign( {}, this.defaults, options );

        if ( this.options.handleErrors ) {
            this.all();
        }
    }

    all () {
        process.on( 'uncaughtException', ( error ) => {
            this.send( error );
        } );
    }

    sanitizeCode ( code ) {
        let sanitizeCode = code.replace( /\n/gim, '\\n' );

        sanitizeCode = sanitizeCode.replace( /"/gim, '\\"' );

        return sanitizeCode;
    }

    send ( sendOptions ) {
        if ( sendOptions instanceof Error ) {
            let error = sendOptions;

            // eslint-disable-next-line no-param-reassign
            sendOptions = {
                code: error.stack,
                message: error.message,
            };
        }

        const sendData = Object.assign( {}, sendOptions );
        let exitWhenDone = this.options.exitAfterNotification;

        sendData.users = this.options.users;

        if ( typeof sendData.code !== 'undefined' ) {
            sendData.code = this.sanitizeCode( sendData.code );
        }

        if ( typeof sendData.title === 'undefined' && this.options.title ) {
            sendData.title = this.options.title;
        }

        if ( typeof sendOptions.exit !== 'undefined' ) {
            exitWhenDone = sendOptions.exit;
            Reflect.deleteProperty( sendOptions, 'exit' );
        }

        const requestOptions = Object.assign( {}, this.options.post );

        const postData = JSON.stringify( sendData );

        requestOptions.headers[ 'Content-Length' ] = Buffer.byteLength( postData );

        const request = https.request( requestOptions, () => {
            if ( exitWhenDone ) {
                process.exit( 1 );
            }
        } );

        request.write( postData );
        request.end();
    }
}

module.exports = Notifyy;
