/**
 * Se almacena la configuracion de SAP
 * @author David Corredor Ramírez
 */

const protocol = 'http://'


export default {
    sysnr: process.env.SYSNR || '00',
    ashost: process.env.HOST || `${protocol}172.19.139.35`,
    client: process.env.CLIENT || '300',
    user: process.env.USER || '',
    passwd: process.env.PASSWORD || '',
    lang: process.env.LANG || 'es'
}