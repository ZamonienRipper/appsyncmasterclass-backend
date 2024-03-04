require('dotenv').config()
const when = require('../../steps/when')
const chance = require('chance').Chance()

describe('When getImageUploadUrl runs', () => {
  it.each([
    ['.png', 'image/png'],
    [ '.jpeg', 'image/jpeg'],
    [ '.jpeg', null],
    [ null, 'image/jpeg'],
    [ null, null],
  ])('Returns a signed S3 url for extension %s and content type %s', async (extension, contentType) => {
    const username = chance.guid()
    const signedUrl = await when.we_invoke_getImageUploadUrl(username, extension, contentType)

    const { BUCKET_NAME } = process.env
    //const regex = RegExp(`https://s3.*.amazonaws.com*`)
    const regex = new RegExp(`https://${BUCKET_NAME}.s3-accelerate.amazonaws.com/${username}/.*${extension || ''}\?.*Content-Type=${contentType ? contentType.replace('/', '%2F') : 'image'}*`)
    expect(signedUrl).toMatch(regex)
  })
})