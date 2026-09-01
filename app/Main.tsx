'use client'

import { useState, useEffect } from 'react'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate.js'
import NewsletterForm from 'pliny/ui/NewsletterForm.js'
import { RoughNotation } from 'react-rough-notation'

const MAX_DISPLAY = 5

export default function Home({ posts }) {
  const [showHighlight, setShowHighlight] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHighlight(true)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <div className="mb-12 flex flex-col items-center gap-x-12 xl:flex-row">
        <div className="pt-6">
          <h1 className="pb-6 text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
            Hi, I am{' '}
            <span className="text-primary-color-500 dark:text-primary-color-dark-500">Sabarni</span>
          </h1>
          <h2 className="prose pt-5 text-lg text-gray-600 dark:text-gray-300">
            {`Welcome to ${siteMetadata.description}. I am a Frontend Engineer who is passionate about React. In my free time, I like developing `}
            side projects and learning new technologies.
          </h2>
          <p className="pt-5 text-lg leading-7 text-slate-600 sm:block md:hidden lg:hidden dark:text-slate-300">
            This is my place for{' '}
            <RoughNotation
              animate
              type="box"
              show={true}
              color="#DE1D8D"
              animationDelay={1000}
              animationDuration={2500}
            >
              thoughts, reflections & everything&nbsp;
            </RoughNotation>
            in between. Have a good read!
          </p>
          <div className="hidden pt-10 text-lg leading-7 text-slate-600 md:block dark:text-slate-300">
            This is my place for{' '}
            <RoughNotation
              animate
              type="highlight"
              show={showHighlight}
              color="#DE1D8D"
              animationDelay={0}
              animationDuration={2500}
            >
              <span className={showHighlight ? 'animate-highlight-text' : ''}>
                thoughts, reflections & everything&nbsp;
              </span>
            </RoughNotation>
            in between. Have a good read!{' '}
            <div className="mt-8 text-slate-600 dark:text-slate-400">
              <span className="text-sm">Press</span>{' '}
              <span className="rounded-md bg-gray-300 p-1 text-sm text-gray-900 dark:bg-gray-400">
                ⌘
              </span>{' '}
              <span className="text-sm">+ </span>
              <span className="rounded-md bg-gray-300 p-1 text-sm text-gray-900 dark:bg-gray-400">
                K
              </span>{' '}
              <span className="text-sm">to start</span>
            </div>
          </div>
        </div>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h2 className="flex pb-6 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-3xl md:text-5xl dark:text-gray-100">
            Latest
          </h2>
        </div>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {!posts.length && 'No posts found.'}
          {posts.slice(0, MAX_DISPLAY).map((post) => {
            const { slug, date, title, summary, tags } = post
            return (
              <li key={slug} className="py-12">
                <article>
                  <div className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                    <dl>
                      <dt className="sr-only">Published on</dt>
                      <dd className="text-base leading-6 font-medium text-gray-500 dark:text-gray-400">
                        <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                      </dd>
                    </dl>
                    <div className="space-y-5 xl:col-span-3">
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-2xl leading-8 font-bold tracking-tight">
                            <Link
                              href={`/blog/${slug}`}
                              className="text-gray-900 dark:text-gray-100"
                            >
                              {title}
                            </Link>
                          </h2>
                          <div className="flex flex-wrap">
                            {tags.map((tag) => (
                              <Tag key={tag} text={tag} />
                            ))}
                          </div>
                        </div>
                        <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                          {summary}
                        </div>
                      </div>
                      <div className="text-base leading-6 font-medium">
                        <Link
                          href={`/blog/${slug}`}
                          className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                          aria-label={`Read more: "${title}"`}
                        >
                          Read more &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </div>
      {posts.length > MAX_DISPLAY && (
        <div className="flex justify-end text-base leading-6 font-medium">
          <Link
            href="/blog"
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            aria-label="All posts"
          >
            All Posts &rarr;
          </Link>
        </div>
      )}
      {siteMetadata.newsletter?.provider && (
        <div className="flex items-center justify-center pt-4">
          <NewsletterForm />
        </div>
      )}
    </>
  )
}
