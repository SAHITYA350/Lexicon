import { useState } from 'react';

const App = () => {
  const [word, setWord] = useState('');
  const [loading, setLoading] = useState(false);
  const [wordDetails, setWordDetails] = useState(null);
  const [error, setError] = useState('');

  const searchWord = async () => {
    if (!word?.trim()) return;
    
    setLoading(true);
    setError('');
    setWordDetails(null);
    
    try {
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.trim()}`);
      
      if (!res.ok) {
        setError('Word not found. Please try another word.');
        return;
      }
      
      const data = await res.json();
      setWordDetails(data);
      setWord('');
    } catch (err) {
      setError('An error occurred. Please try again.',err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchWord();
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-800 text-white">
      {/* Premium silk-like overlay */}
      <div className="absolute inset-0 bg-linear-to-tr from-transparent via-gray-500/5 to-transparent pointer-events-none"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <header className="text-center mb-12 md:mb-16">
          <div className="inline-block">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold bg-linear-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent mb-3">
              Lexicon
            </h1>
            <div className="h-1 bg-linear-to-r from-transparent via-gray-400 to-transparent"></div>
          </div>
          <p className="mt-4 text-gray-400 text-sm md:text-base font-light tracking-wide">
            Sahitya Ghosh || 8777099335
          </p>
        </header>

        {/* Search Box */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search a word..."
              className="w-full px-6 py-4 md:py-5 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-600/50 transition-all backdrop-blur-sm text-base md:text-lg"
            />
            <button
              onClick={searchWord}
              disabled={loading || !word.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 md:py-2.5 bg-linear-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 disabled:from-gray-800 disabled:to-gray-800 disabled:cursor-not-allowed text-white rounded-md transition-all font-medium text-sm md:text-base"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

         {loading && (
          <div className="max-w-3xl mx-auto mb-8">
            <div className="bg-linear-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-md border border-gray-700/50 rounded-2xl p-12 shadow-2xl">
              <div className="flex flex-col items-center gap-6">
                {/* Animated rings */}
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 border-4 border-gray-700 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-transparent border-t-gray-400 rounded-full animate-spin"></div>
                  <div className="absolute inset-2 border-4 border-transparent border-t-gray-500 rounded-full animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}></div>
                  <div className="absolute inset-4 border-4 border-transparent border-t-white rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
                </div>
                
                <div className="text-center">
                  <h3 className="text-xl font-serif bg-linear-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent mb-2">
                    Searching Dictionary
                  </h3>
                  <div className="flex gap-1 justify-center">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="max-w-3xl mx-auto mb-8 p-4 bg-red-900/20 border border-red-800/50 rounded-lg text-red-300 text-center">
            {error}
          </div>
        )}

        {/* Results */}
        {wordDetails && wordDetails.length > 0 && (
          <div className="max-w-5xl mx-auto space-y-8">
            {wordDetails.map((entry, entryIdx) => (
              <div
                key={entryIdx}
                className="bg-linear-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 md:p-10 shadow-2xl"
              >
                {/* Word Header */}
                <div className="border-b border-gray-700/50 pb-6 mb-8">
                  <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
                    {entry.word}
                  </h2>
                  
                  {/* Phonetics - Only show unique phonetics */}
                  {entry.phonetics && entry.phonetics.length > 0 && (
                    <div className="space-y-3">
                      {(() => {
                        const seen = new Set();
                        return entry.phonetics
                          .filter(phonetic => {
                            if (!phonetic.text) return false;
                            if (seen.has(phonetic.text)) return false;
                            seen.add(phonetic.text);
                            return true;
                          })
                          .map((phonetic, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-3">
                              <span className="text-gray-400 font-mono text-lg md:text-xl">
                                {phonetic.text}
                              </span>
                              {phonetic.audio && (
                                <audio
                                  controls
                                  className="h-8 md:h-10 opacity-80 hover:opacity-100 transition-opacity"
                                  style={{ maxWidth: '100%' }}
                                >
                                  <source src={phonetic.audio} type="audio/mpeg" />
                                </audio>
                              )}
                            </div>
                          ));
                      })()}
                    </div>
                  )}
                </div>

                {/* Meanings */}
                {entry.meanings && entry.meanings.map((meaning, meaningIdx) => (
                  <div key={meaningIdx} className="mb-8 last:mb-0">
                    <div className="flex items-center gap-3 mb-6">
                      <h3 className="text-xl md:text-2xl font-serif italic text-gray-300">
                        {meaning.partOfSpeech}
                      </h3>
                      <div className="flex-1 h-px bg-linear-to-r from-gray-600 to-transparent"></div>
                    </div>

                    {/* Definitions */}
                    {meaning.definitions && (
                      <div className="space-y-6">
                        {meaning.definitions.map((def, defIdx) => (
                          <div key={defIdx} className="pl-4 border-l-2 border-gray-700">
                            <div className="flex items-start gap-3 mb-2">
                              <span className="text-gray-500 font-semibold mt-1 text-sm">
                                {defIdx + 1}.
                              </span>
                              <p className="text-gray-200 leading-relaxed text-base md:text-lg flex-1">
                                {def.definition}
                              </p>
                            </div>
                            
                            {/* Example */}
                            {def.example && (
                              <div className="ml-8 mt-3 p-3 bg-gray-900/50 border-l-2 border-gray-600 rounded">
                                <p className="text-gray-400 italic text-sm md:text-base">
                                  "{def.example}"
                                </p>
                              </div>
                            )}

                            {/* Synonyms for this definition */}
                            {def.synonyms && def.synonyms.length > 0 && (
                              <div className="ml-8 mt-3">
                                <span className="text-gray-500 text-sm font-semibold">Similar: </span>
                                <span className="text-gray-400 text-sm">
                                  {def.synonyms.join(', ')}
                                </span>
                              </div>
                            )}

                            {/* Antonyms for this definition */}
                            {def.antonyms && def.antonyms.length > 0 && (
                              <div className="ml-8 mt-2">
                                <span className="text-gray-500 text-sm font-semibold">Opposite: </span>
                                <span className="text-gray-400 text-sm">
                                  {def.antonyms.join(', ')}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Overall Synonyms */}
                    {meaning.synonyms && meaning.synonyms.length > 0 && (
                      <div className="mt-6 p-4 bg-gray-900/30 rounded-lg">
                        <h4 className="text-gray-400 font-semibold mb-2 text-sm uppercase tracking-wider">
                          Synonyms
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {meaning.synonyms.map((syn, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full text-sm"
                            >
                              {syn}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Overall Antonyms */}
                    {meaning.antonyms && meaning.antonyms.length > 0 && (
                      <div className="mt-4 p-4 bg-gray-900/30 rounded-lg">
                        <h4 className="text-gray-400 font-semibold mb-2 text-sm uppercase tracking-wider">
                          Antonyms
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {meaning.antonyms.map((ant, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full text-sm"
                            >
                              {ant}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Source & License */}
                <div className="mt-8 pt-6 border-t border-gray-700/50 text-xs md:text-sm text-gray-500">
                  {entry.sourceUrls && entry.sourceUrls.length > 0 && (
                    <p className="mb-2">
                      <span className="font-semibold">Source: </span>
                      <a
                        href={entry.sourceUrls[0]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-gray-300 underline"
                      >
                        {entry.sourceUrls[0]}
                      </a>
                    </p>
                  )}
                  {entry.license && (
                    <p>
                      <span className="font-semibold">License: </span>
                      <a
                        href={entry.license.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-gray-300 underline"
                      >
                        {entry.license.name}
                      </a>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-500 text-sm">
          <div className="h-px bg-linear-to-r from-transparent via-gray-700 to-transparent mb-6"></div>
          <p>Powered by Free Dictionary API</p>
        </footer>
      </div>
    </div>
  );
};

export default App;