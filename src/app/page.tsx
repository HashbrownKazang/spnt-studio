import { Hero } from '@/components/Hero';
import { supabase } from '@/lib/supabase-client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default async function Page() {
  // Fetch episodes from Supabase
  const { data: episodes, error } = await supabase
    .from('episodes')
    .select('*')
    .order('publication_date', { ascending: false })

  if (error) {
    console.error('Error fetching episodes:', error)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Hero 
        title="s p u n t e n t e r t a i n m e n t"
        subtitle="spuntentertainment is not responsible"
        imageSrc="/hero-image.png"
      />

      <div className="px-4 py-8">
        {/* Live Show Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Live Now</h2>
          <div className="bg-gray-100 rounded-lg p-8 text-center">
            <p className="text-lg mb-4">No live show currently airing</p>
            <Button variant="default" size="lg">
              Listen Now
            </Button>
          </div>
        </section>

        {/* Episode Catalog */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Previous Episodes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {episodes?.map((episode) => (
              <Card
                key={episode.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
              >
                <a href={`/episodes/${episode.id}`} className="block">
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{episode.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{episode.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {new Date(episode.publication_date).toLocaleDateString()}
                      </span>
                      <span className="text-sm text-gray-500">
                        {Math.floor(episode.duration / 60)} min
                      </span>
                    </div>
                  </div>
                </a>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
