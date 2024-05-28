import { AxiosError } from "axios";
import { User } from "../../Domain/entities/User";
import { AuthRepository } from "../../Domain/repositories/AuthRepository";
import { ApiDelivery, ApiDeliveryForImage } from "../sources/remote/api/ApiDelivery";
import { ResponseApiDelivery } from "../sources/remote/models/ResponseApiDelivery";
import mime from 'mime';
import * as ImagePicker from 'expo-image-picker';

export class AuthRepositoryImpl implements AuthRepository {

    async register(user: User): Promise<ResponseApiDelivery> {
        try {
            
            const response = await ApiDelivery.post<ResponseApiDelivery>('/users/create', user);
            return Promise.resolve(response.data);

        } catch (error) {
            let e = (error as AxiosError);
            console.log('ERROR: ' + JSON.stringify(e.response?.data));
            const apiError:ResponseApiDelivery = JSON.parse(JSON.stringify(e.response?.data)); 
            return Promise.resolve(apiError)
        }
    }

    async registerWithImage(user: User, file: ImagePicker.ImagePickerAsset | null): Promise<ResponseApiDelivery> {
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
    
            const response = await ApiDeliveryForImage.post<ResponseApiDelivery>('/users/createWithImage', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            return Promise.resolve(response.data);
        } catch (error) {
            let e = error as AxiosError;
            console.log('ERROR: ' + JSON.stringify(e.response?.data));
            const apiError: ResponseApiDelivery = JSON.parse(JSON.stringify(e.response?.data));
            return Promise.resolve(apiError);
        }
    }
    
    
    
    async login(email: string, password: string): Promise<ResponseApiDelivery> {
        try {
            
            const response = await ApiDelivery.post<ResponseApiDelivery>('/users/login', {
                email: email,
                password: password                
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