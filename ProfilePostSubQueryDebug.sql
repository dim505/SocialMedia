
declare @LoggedInUser varchar(255) = 'auth0|5e08ad7807b79e0e86d202be'

declare @Auth0IDAuthor varchar(255) = 'auth0|5e08ad7807b79e0e86d202be'

IF DBO.IsUserAFollower(@LoggedInUser, @Auth0IDAuthor) > 0 
BEGIN
   SELECT
      '-1' AS auth0idauthor 
END
ELSE
   /*profile posts*/
   BEGIN
      SELECT
         auth0idauthor,
         AcctInfo.ProfilePhotoUrl,
         a.postguid,
         AcctInfo.fullname,
         datecreated,
         postcontent,
         (
            select
               count(*) 
            from
               SM_LikeCommentTable 
            where
               a.PostGuid = PostGuid 
         )
         as PostLikeCount,
         case
            when
               (
                  select
                     count(*) 
                  from
                     SM_LikeCommentTable 
                  where
                     @Auth0IDAuthor = Auth0IDWhoLiked 
                     and a.PostGuid = PostGuid 
               )
               >= 1 
            then
               CAST(1 AS BIT) 
            else
               CAST(0 AS BIT) 
         end
         as DidUserLikePost, disablesharing, disablecomments, FileUrl, filetype, TempTagList, 	
         case when @LoggedInUser <> @Auth0IDAuthor then 'True' else 'False' end as DisablePostMenu
      FROM
         (
            SELECT
               auth0idauthor,
               Post.postguid,
               datecreated,
               postcontent,
               CASE
                  WHEN
                     post.disablesharing <> 'True' 
                  THEN
                     'False'
                     Else 'True'
               END
               AS DisableSharing, 
               CASE
                  WHEN
                     post.disablecomments <> 'True' 
                  THEN
                     'False' 
                  else 'True'
               END
               AS DisableComments 
            FROM
               sm_posts Post 
         )
         a 
         INNER JOIN
            sm_account_info AcctInfo 
            ON auth0idauthor = AcctInfo.auth0id 
         LEFT JOIN
            sm_posts_file_urls 
            ON a.postguid = sm_posts_file_urls.postguid 
      WHERE
         auth0idauthor = @Auth0IDAuthor 
      GROUP BY
         auth0idauthor, AcctInfo.ProfilePhotoUrl, AcctInfo.fullname, a.postguid, datecreated, postcontent, disablesharing, disablecomments, fileurl, filetype, TempTagList 
      order by
         convert(datetime, DateCreated) desc 
   end