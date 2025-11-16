export async function sendChatMessage({
                                          token,
                                          message,
                                          latitude,
                                          longitude,
                                      }: {
    token: string;
    message: string;
    latitude: number;
    longitude: number;
}) {
    const res = await fetch("https://timy-calendar-b3e8cdgtapccazbd.polandcentral-01.azurewebsites.net/agent/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            message,
            latitude,
            longitude,
        }),
    });

    if (!res.ok) {
        throw new Error("Failed to reach server");
    }

    return res.json(); // { response: [...] }
}
