import {NetworkConfig} from "../apis/network/network/index";

const Release = true;

const SoftwareVersion = `${Release?'':'Ecglet_Stage'} 0.1.1`;

const PostUrl = `https://backend.${Release?'':'stage.'}hipee.cn/hipee-web-hiecg/`;
const UploadUrl = 'https://backend.hipee.cn/hipee-upload/hibox/mp/upload/image.do';
NetworkConfig.setConfig({postUrl: PostUrl});

export {
    PostUrl,
    UploadUrl,
    SoftwareVersion,
    Release
};
