import env from '../env';

export default function authorize(token, post) {
    console.log(typeof post);
    const url = `${env.API_HOST}/api/auth?token=${token}`;
    return post(token);
}
