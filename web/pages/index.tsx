import Head from "next/head";
import Nav from "../components/Nav";
import {GetStaticProps} from "next";
import ChannelCard, {IndexChannelData} from "../components/ChannelCard";
import {DateTime, Interval} from "luxon";

type HomeProps = {
  lastUpdate: string
  channels: Array<IndexChannelData>
}

export default function Home({channels, lastUpdate}: HomeProps) {
  let lastUpdated: string;

  const now = DateTime.utc();
  const lastUpdateDate = DateTime.fromISO(lastUpdate, {zone: "utc"});
  const diff = Interval.fromDateTimes(lastUpdateDate, now);
  console.log(now.toISO());
  console.log(lastUpdateDate.toISO());
  if (diff.length("minutes") <= 60) {
    const rounded = Math.floor(diff.length("minutes"));
    if (rounded === 1) {
      lastUpdated = `${rounded} minute ago`;
    } else {
      lastUpdated = `${rounded} minutes ago`;
    }
  } else if (diff.length("hours") <= 24) {
    const rounded = Math.floor(diff.length("hours"));
    if (rounded === 1) {
      lastUpdated = `${rounded} hour ago`;
    } else {
      lastUpdated = `${rounded} hours ago`;
    }
  } else if (diff.length("days") <= 7) {
    const rounded = Math.floor(diff.length("days"));
    if (rounded === 1) {
      lastUpdated = `${rounded} day ago`;
    } else {
      lastUpdated = `${rounded} days ago`;
    }
  } else {
    lastUpdated = lastUpdateDate.toISO();
  }

  return (
    <>
      <Head>
        <title>Twitch Overlap</title>
        <meta property="og:title" content="Twitch Overlap"/>
        <meta property="og:description"
              content="The site shows stats about the overlap of chatters from different channels on Twitch. You can find out who your favorite streamer shares viewers with, or how many people are currently chat hopping. The site is open source on GitHub."/>
      </Head>
      <Nav/>
      <div className="container w-full md:max-w-5xl xl:max-w-7xl mx-auto tracking-tight mt-16 mb-20">
        <div className="px-2 md:px-4 pt-4">
          <h1 className="font-medium tracking-tighter text-5xl text-center mb-4">Twitch Community Overlap</h1>
          <p className="mb-2">The site shows stats about the overlap of chatters from different channels. You can find
            who&apos;s community overlaps the most with your favorite streamer. You can also check which channels chat
            hoppers are going to. Currently tracks all channels over 1000 concurrent viewers. Data updates every 30
            minutes.</p>
          <div className="flex mb-2">
            <div className="mb-1 pr-1">Last Updated:</div>
            <div className="font-medium" title={lastUpdate}>{lastUpdated}</div>
          </div>
        </div>
        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4 mx-2 sm:mx-4">
          {channels.map(x =>
            <ChannelCard key={x.id} id={x.id} avatar={x.avatar} displayName={x.displayName} chatters={x.chatters}/>
          )}
        </div>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const res = await fetch("http://192.168.1.104:5000/api/v1/index");
  const data = await res.json();

  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      channels: data.channels,
      lastUpdate: data.lastUpdate
    },
    revalidate: 60
  };
};
