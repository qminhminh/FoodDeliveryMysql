import { AxiosError } from "axios";
import { ImagePickerAsset} from "expo-image-picker";
import mime from "mime";
import { User } from "../../Domain/entities/User";
import { UserRepository } from "../../Domain/repositories/UserRepository";
import { ApiDelivery, ApiDeliveryForImage } from "../sources/remote/api/ApiDelivery";
import { ResponseApiDelivery } from "../sources/remote/models/ResponseApiDelivery";

export class UserRepositoryImpl implements UserRepository {

    async update(user: User): Promise<ResponseApiDelivery> {
        try {
            const response = await ApiDelivery.put<ResponseApiDelivery>('/users/updateWithoutImage', user);
            return Promise.resolve(response.data);
        } catch (error) {
            let e = (error as AxiosError);
            console.log('ERROR: ' + JSON.stringify(e.response?.data));
            const apiError:ResponseApiDelivery = JSON.parse(JSON.stringify(e.response?.data)); 
            return Promise.resolve(apiError)
        }
    }

    async updateWithImage(user: User, file: ImagePickerAsset | null): Promise<ResponseApiDelivery> {
        try {
            let data = new FormData();
            
            if (file?.uri) {
                // Create a new file object from the uri
                const localUri = file.uri;
                const filename = localUri.split('/').pop();
                const match = /\.(\w+)$/.exec(filename!);
                const type = match ? `image/${match[1]}` : `image`;
    
                data.append('image', {
                    uri: localUri,
                    type: type,
                    name: filename,
                } as any); // Cast to 'any' to bypass TypeScript issues
            }
            data.append('user', JSON.stringify(user));
            const response = await ApiDeliveryForImage.put<ResponseApiDelivery>('/users/update', data,{
                headers: {
                    'Content-type': 'multipart/form-data',
                    'accept': 'application/json',
                }
            });
            return Promise.resolve(response.data);

        } catch (error) {
            let e = (error as AxiosError);
            console.log('ERROR: ' + JSON.stringify(e.response?.data));
            const apiError:ResponseApiDelivery = JSON.parse(JSON.stringify(e.response?.data)); 
            return Promise.resolve(apiError)
        }
    }

}