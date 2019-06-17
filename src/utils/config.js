import {NetworkConfig} from "../apis/network/network/index";

const Release = false;

const SoftwareVersion = `${Release?'':'Ecglet_Stage'} 1.6.5`;

const PostUrl = `http://backend.${Release?'':'stage.'}hipee.cn/hipee-web-hiecg/`;
const UploadUrl = 'http://backend.hipee.cn/hipee-upload/hibox/mp/upload/image.do';
NetworkConfig.setConfig({postUrl: PostUrl});

export {
    PostUrl,
    UploadUrl,
    SoftwareVersion,
    Release
};
