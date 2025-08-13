export async function extractAgriculturalInsights(transcription: string): Promise<string[]> {
  try {
    const response = await fetch('/api/insights', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: transcription }),
    });

    if (!response.ok) {
      console.error('Failed to fetch AI insights:', response.statusText);
      return [];
    }

    console.log(response)

    const result = await response.json();
    const insights = result.data

    console.log(result)

    if (!insights || !Array.isArray(insights)) {
      console.error('API response missing insights array:', insights);
      return [];
    }

    console.log(insights)

    return insights;
  } catch (error) {
    console.error('Error calling insights API:', error);
    return [];
  }
}
