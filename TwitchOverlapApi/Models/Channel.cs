using System;
using System.Collections.Generic;
using MongoDB.Bson.Serialization.Attributes;

namespace TwitchOverlapApi.Models
{
    public class Channel
    {
        [BsonId]
        public string Id { get; set; }
        public DateTime Timestamp { get; set; }
        public string Game { get; set; }
        public int Viewers { get; set; }
        public int Chatters { get; set; }
        public int Overlap { get; set; }
        public Dictionary<string, int> Data { get; set; }
    }

    public class ChannelGames
    {
        [BsonId]
        public string Id { get; set; }
        public string Game { get; set; }
    }

    public class ChannelProjection
    {
        public string Id { get; set; }
        public DateTime Timestamp { get; set; }
        public string Game { get; set; }
        public int Viewers { get; set; }
        public int Chatters { get; set; }
        public int Overlap { get; set; }
        public Dictionary<string, Data> Data { get; set; }
    }

    public class Data
    {
        public int Shared { get; set; }
        public string Game { get; set; }
    }

    public class ChannelSummary
    {
        public string Id { get; set; }
        public int Chatters { get; set; }
    }
}