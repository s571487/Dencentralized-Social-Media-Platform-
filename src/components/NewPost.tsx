import React, { useState } from 'react';
import { ImagePlus, X, Loader2 } from 'lucide-react';

const NewPost = () => {
  const [description, setDescription] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [media, setMedia] = useState<File | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setMedia(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      alert('File size exceeds 5MB limit.');
    }
  };

  const removeMedia = () => {
    setMedia(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handlePost = async () => {
    setIsPosting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log({ description, hashtags, media });
    setIsPosting(false);
    setDescription('');
    setHashtags('');
    setMedia(null);
    setPreviewUrl(null);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-4xl mx-auto">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Create post</h2>
      </div>
      
      <div className="p-4 space-y-4">
        <textarea
          className="w-full min-h-[120px] p-3 text-gray-900 dark:text-gray-100 bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="text"
          className="w-full p-3 text-gray-900 dark:text-gray-100 bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
          placeholder="Add hashtags (e.g., #nature, #photography)"
          value={hashtags}
          onChange={(e) => setHashtags(e.target.value)}
        />

        {!media ? (
          <div className="relative">
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleMediaUpload}
              className="hidden"
              id="media-upload"
            />
            <label
              htmlFor="media-upload"
              className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
            >
              <div className="flex flex-col items-center space-y-2 text-gray-500 dark:text-gray-400">
                <ImagePlus className="w-8 h-8" />
                <span>Add photos or videos</span>
                <span className="text-xs">Maximum file size: 5MB</span>
              </div>
            </label>
          </div>
        ) : (
          <div className="relative">
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
              />
            )}
            <button
              onClick={removeMedia}
              className="absolute top-2 right-2 p-1 bg-gray-900/60 rounded-full text-white hover:bg-gray-900/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button 
          className="w-full py-2.5 px-4 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          onClick={handlePost}
          disabled={isPosting || (!description && !media)}
        >
          {isPosting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Posting...</span>
            </>
          ) : (
            <span>Post</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default NewPost;