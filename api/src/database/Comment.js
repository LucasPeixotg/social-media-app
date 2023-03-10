const driver = require('../config/dbDriver').getConnection()

class Comment {
    static async commentPost(userId, postId, content) {
        const session = driver.session({ database: 'neo4j' })
    
        console.log('ok')
        const query = `
            MATCH (user:USER) WHERE ID(user)=$userId
            MATCH (post:POST) WHERE ID(post)=$postId
            MERGE (user)-[publish:PUBLISH]->(comment:COMMENT)-[:COMMENTS]->(post)
            SET publish.date=$date
            SET comment.content=$content
            RETURN comment
        `
    
        const queryOptions = {
            userId: parseInt(userId),
            postId: parseInt(postId),
            content,
            date: Date.now()
        }
    
        let result
        try {
            const queryResponse = await session.run(query, queryOptions)
            result = queryResponse.records[0]._fields[0].properties
        } catch(error) {
            console.error(error)
        } finally {
            await session.close()
            return result
        }
    }

    static async commentComment(userId, commentId, content) {
        const session = driver.session({ database: 'neo4j' })

        const query = `
            MATCH (user:USER) WHERE ID(user)=$userId
            MATCH (c:COMMENT) WHERE ID(c)=$commentId
            CREATE (user)-[publish:PUBLISH]->(comment:COMMENT)-[:COMMENTS]->(c)
            SET publish.date=$date
            SET comment.content=$content
            RETURN comment
        `

        const queryOptions = {
            userId: parseInt(userId),
            commentId: parseInt(commentId),
            content,
            date: Date.now()
        }

        let result
        try {
            const queryResponse = await session.run(query, queryOptions)
            result = queryResponse.records[0]._fields[0].properties
        } catch(error) {
            console.error(error)
        } finally {
            await session.close()
            return result
        }
    }
}

module.exports = Comment
