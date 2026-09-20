import { supabase } from './supabaseClient';

export async function uploadContractFile(file) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/${Date.now()}_${file.name}`;

    const { data, error } = await supabase.storage
        .from('contracts')
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
        });

    if (error) throw error;

    // Get the public/signed URL
    const { data: urlData } = supabase.storage
        .from('contracts')
        .getPublicUrl(filePath);

    return {
        path: data.path,
        url: urlData?.publicUrl || filePath
    };
}

export async function getFileUrl(filePath) {
    const { data, error } = await supabase.storage
        .from('contracts')
        .createSignedUrl(filePath, 3600); // 1 hour

    if (error) throw error;
    return data.signedUrl;
}
