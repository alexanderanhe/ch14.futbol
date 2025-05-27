import { VideoCameraIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'
import { saveVideo } from '../data';

// template source: https://tailwindcss.com/plus/ui-blocks/application-ui/forms/form-layouts
export default function UploadPage() {
  const [form, setForm] = useState<Record<string, string>>({})
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({...prev, [event.target.name]: event.target.value}));
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log(form)
    const save = await saveVideo(form);
    console.log(save)
  }
  return (
    <form className='p-4' onSubmit={handleSubmit}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base/7 font-semibold">Create new video</h2>
          <p className="mt-1 text-sm/6 text-gray-400">
            This information will be displayed publicly so be careful what you share.
          </p>

          <div className="mt-7 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label className="block text-sm/6 font-medium">
                Title
                <div className="mt-2">
                  <input
                    id="title"
                    name="title"
                    type="text"
                    onChange={handleChange}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </label>
            </div>

            <div className="col-span-full">
              <label className="block text-sm/6 font-medium">
                Description
              </label>
              <div className="mt-2">
                <textarea
                  id="description"
                  name="description"
                  onChange={handleChange}
                  rows={3}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  defaultValue={''}
                />
              </div>
              <p className="mt-3 text-sm/6 text-gray-400">Write a few sentences about yourself.</p>
            </div>

            <div className="sm:col-span-4">
              <label className="block text-sm/6 font-medium">
                Link
                <div className="mt-2">
                  <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                    <div className="shrink-0 text-base text-gray-500 select-none sm:text-sm/6">supabase/</div>
                    <input
                      id="url"
                      name="url"
                      type="text"
                      onChange={handleChange}
                      placeholder="file.mp4"
                      className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-black placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                    />
                  </div>
                </div>
              </label>
            </div>

            <div className="sm:col-span-2 sm:col-start-1">
              <label className="block text-sm/6 font-medium">
                Expire
                <div className="mt-2">
                  <input
                    id="expire"
                    name="expire"
                    type="date"
                    onChange={handleChange}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </label>
            </div>

            <div className="col-span-full">
              <label htmlFor="cover-photo" className="block text-sm/6 font-medium">
                Video
              </label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-200/25 px-6 py-10">
                <div className="text-center">
                  <VideoCameraIcon aria-hidden="true" className="mx-auto size-12 text-gray-300" />
                  <div className="mt-4 flex text-sm/6 text-gray-400">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md font-semibold text-indigo-600 focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:outline-hidden hover:text-indigo-500"
                    >
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs/5 text-gray-400">MP4 up to 50MB</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" className="text-sm/6 font-semibold">
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save
        </button>
      </div>
    </form>
  )
}