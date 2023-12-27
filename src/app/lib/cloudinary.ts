export async function imageUpload(formData: FormData) {
    try {
        const res = await fetch(
            "https://api.cloudinary.com/v1_1/dv8jpo92u/image/upload",
            {
                method: "POST",
                body: formData,
            }
        );
        if (res.ok) {
            return await res.json();
        } else {
            throw new Error();
        }
    } catch (error) {
        throw new Error();
    }
}
