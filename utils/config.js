import {NetworkConfig} from "../apis/network/network/index";

const Release = false;

const SoftwareVersion = `${Release?'版本':'Ecglet_Stage'} v0.1.3`;

const PostUrl = `https://backend.${Release?'':'stage.'}hipee.cn/hipee-web-hiecg/`;
const UploadUrl = 'https://backend.hipee.cn/hipee-upload/hibox/mp/upload/image.do';
NetworkConfig.setConfig({postUrl: PostUrl});

export {
    PostUrl,
    UploadUrl,
    SoftwareVersion,
    Release
};
