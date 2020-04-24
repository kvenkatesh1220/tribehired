const axios = require("axios");
// const _ = require("lodash");

var groupBy = function (comments, key) {
    return comments.reduce(function (acc, comment) {
        acc[comment[key]] = (acc[comment[key]] || 0) + 1;
        return acc;
    }, {});
};

async function topThreePosts(req, res) {
    try {
        const comments = await axios.get(
            "https://jsonplaceholder.typicode.com/comments"
        );
        const groupResult = groupBy(comments.data, "postId");
        const groupResultArr = Object.entries(groupResult);
        // const groupResult = _.groupBy(comments.data, "postId");
        groupResultArr.sort((a, b) => {
            return a[1] > b[1] ? -1 : 1;
        });
        const requiredComments = groupResultArr.slice(0, 3);
        console.log(groupResultArr);
        const promisesArray = [];
        requiredComments.forEach((arr) => {
            promisesArray.push(
                axios.get(`https://jsonplaceholder.typicode.com/posts/${arr[0]}`)
            );
        });

        const result = await Promise.all(promisesArray);
        result.forEach((post, i) => {
            const data = {};
            data.post_id = post.data.id;
            data.post_title = post.data.title;
            data.post_body = post.data.body;
            data.total_number_of_comments = requiredComments[i][1];
            result[i] = data;
        });
        return res.status(200).json(result);
    } catch (e) {
        console.log(e);
        return res.status(e.response.status).json({ message: e.message });
    }
}

async function search(req, res) {
    try {
        const query = req.query;
        var queryString = Object.keys(query)
            .map(function (key) {
                return key + "=" + query[key];
            })
            .join("&");
        const comments = await axios.get(
            `https://jsonplaceholder.typicode.com/comments?${queryString}`
        );
        return res.status(200).json(comments.data);
    } catch (e) {
        return res.status(e.response.status).json({ message: e.message });
    }
}

module.exports = {
    topThreePosts,
    search,
};
