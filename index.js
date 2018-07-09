const https = require( 'https' );

const NOTIFYY_SUCCESS_CODE = 204;
const NOTIFYY_ERROR_CODE = 400;

class Notifyy {
    constructor ( options ) {
        if ( typeof options.users !== 'object' && typeof options.users !== 'string' ) {
            throw new Error( 'Missing users. At least one must be supplied' );
        }

        this.defaults = {
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
        return new Promise( ( resolve, reject ) => {
            if ( sendOptions instanceof Error ) {
                const error = sendOptions;

                // eslint-disable-next-line no-param-reassign
                sendOptions = {
                    code: error.stack,
                    message: error.message,
                };
            }

            const sendData = Object.assign( {}, sendOptions );

            sendData.users = this.options.users;

            if ( typeof sendData.code !== 'undefined' ) {
                sendData.code = this.sanitizeCode( sendData.code );
            }

            if ( typeof sendData.title === 'undefined' && this.options.title ) {
                sendData.title = this.options.title;
            }

            const requestOptions = Object.assign( {}, this.options.post );

            const postData = JSON.stringify( sendData );

            requestOptions.headers[ 'Content-Length' ] = Buffer.byteLength( postData );

            const request = https.request( requestOptions, ( response ) => {
                response.setEncoding( 'utf8' );

                if ( response.statusCode === NOTIFYY_ERROR_CODE ) {
                    return reject( new Error( 'Invalid user specified' ) );
                }

                if ( response.statusCode === NOTIFYY_SUCCESS_CODE ) {
                    return resolve();
                }

                return reject( new Error( `Failed with unknown status code ${ response.statusCode }` ) );
            } );

            request.write( postData );
            request.end();
        } );
    }
}

module.exports = Notifyy;
