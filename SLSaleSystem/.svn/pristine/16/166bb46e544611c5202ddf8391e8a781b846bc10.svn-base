package org.slsale.controller;

import java.io.File;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;

import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang.math.RandomUtils;
import org.apache.log4j.Logger;
import org.slsale.common.Constants;
import org.slsale.common.JsonDateValueProcessor;
import org.slsale.common.PageSupport;
import org.slsale.common.SQLTools;
import org.slsale.pojo.DataDictionary;
import org.slsale.pojo.Role;
import org.slsale.pojo.User;
import org.slsale.service.datadictionary.DataDictionaryService;
import org.slsale.service.role.RoleService;
import org.slsale.service.user.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import com.mysql.jdbc.StringUtils;
@Controller
public class UserController extends BaseController {
	private Logger logger = Logger.getLogger(UserController.class);
	
	@Resource
	private UserService userService;
	
	@Resource
	private RoleService roleService;
	
	@Resource
	private DataDictionaryService dataDictionaryService;
	
	@RequestMapping("/backend/modifyPwd.html")
	@ResponseBody
	public Object modifyPwd(@RequestParam String userJson){
		logger.debug("modifyPwd ================ ");
		User sessionUser = this.getCurrentUser();
		if(userJson == null || userJson.equals("")){
			return "nodata";
		}else{
			JSONObject userObject = JSONObject.fromObject(userJson);
			User user = (User)JSONObject.toBean(userObject,User.class);
			user.setId(sessionUser.getId());
			user.setLoginCode(sessionUser.getLoginCode());
			try {
				if(userService.getLoginUser(user)!=null){
					user.setPassword(user.getPassword2());
					user.setPassword2(null);
					userService.modifyUser(user);
				}else{
					return "oldpwdwrong";
				}
			} catch (Exception e) {
				// TODO: handle exception
				return "failed";
			}
		}
		return "success";
	}
	
	/**
	 * 获取用户列表（分页查询）
	 * @return
	 */
	@RequestMapping("/backend/userlist.html")
	public ModelAndView userList(HttpSession session,Model model,
								@RequestParam(value="currentpage",required=false)Integer currentpage ,
								@RequestParam(value="currentPage",required=false) Integer currentPage,
								@RequestParam(value="s_referCode",required=false) String s_referCode,
								@RequestParam(value="s_loginCode",required=false) String s_loginCode,
								@RequestParam(value="s_roleId",required=false) String s_roleId,
								@RequestParam(value="s_isStart",required=false) String s_isStart){
		
		Map<String, Object> baseModel = (Map<String, Object>)session.getAttribute(Constants.SESSION_BASE_MODEL);
		if(baseModel == null){
			return new ModelAndView("redirect:/");
		}else{
			//获取roleList和cardTypeList
			DataDictionary dataDictionary = new DataDictionary();
			dataDictionary.setTypeCode("CARD_TYPE");
			List<Role> roleList = null;
			List<DataDictionary> cardTypeList = null;
			try {
				roleList = roleService.getRoleIdAndNameList();
				cardTypeList = dataDictionaryService.getDataDictionaries(dataDictionary);
			} catch (Exception e) {
				// TODO: handle exception
			}
			//设置查询条件-放入user对象中
			User user = new User();
			if(null != s_loginCode)
				user.setLoginCode("%"+SQLTools.transfer(s_loginCode)+"%");
			if(null != s_referCode)
				user.setReferCode("%"+SQLTools.transfer(s_referCode)+"%");
			if(!StringUtils.isNullOrEmpty(s_isStart))
				user.setIsStart(Integer.valueOf(s_isStart));
			else 
				user.setIsStart(null);
			if(!StringUtils.isNullOrEmpty(s_roleId))
				user.setRoleId(Integer.valueOf(s_roleId));
			else
				user.setRoleId(null);
			//pages 
			PageSupport page = new PageSupport();
			try {
				page.setTotalCount(userService.count(user));
			} catch (Exception e) {
				// TODO: handle exception
				e.printStackTrace();
				page.setTotalCount(0);
			}
			if(page.getTotalCount() > 0){
				if(currentpage != null)
					page.setPage(currentpage);
				if(page.getPage() <= 0)
					page.setPage(1);
				if(page.getPage() > page.getPageCount())
					page.setPage(page.getPageCount());
				user.setStarNum((page.getPage() - 1) * page.getPageSize());
				user.setPageSize(page.getPageSize());
				
				List<User> userList = null;
				try {
					userList = userService.getUserList(user);
				}catch (Exception e) {
					// TODO: handle exception
					e.printStackTrace();
					userList = null;
					if(page == null){
						page = new PageSupport();
						page.setItems(null);
					}
				}
				page.setItems(userList);
			}else{
				page.setItems(null);
			}
			model.addAllAttributes(baseModel);
			model.addAttribute("page", page);
			model.addAttribute("roleList",roleList);
			model.addAttribute("cardTypeList",cardTypeList);
			model.addAttribute("s_loginCode", s_loginCode);
			model.addAttribute("s_referCode", s_referCode);
			model.addAttribute("s_isStart", s_isStart);
			model.addAttribute("s_roleId", s_roleId);
			return new ModelAndView("/backend/userlist");
		}
	}
	
	@RequestMapping(value = "/backend/adduser.html",method=RequestMethod.POST)
	public ModelAndView addUser(HttpSession session,@ModelAttribute("addUser") User addUser){
		if(session.getAttribute(Constants.SESSION_BASE_MODEL) == null){
			return new ModelAndView("redirect:/");
		}else{
			try {
				String idCard = addUser.getIdCard();
				String ps = idCard.substring(idCard.length()-6); 
				addUser.setPassword(ps);
				addUser.setPassword2(ps);
				addUser.setCreateTime(new Date());
				addUser.setReferId(this.getCurrentUser().getId());
				addUser.setReferCode(this.getCurrentUser().getLoginCode());
				addUser.setLastUpdateTime(new Date());
				
				userService.addUser(addUser);
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			return new ModelAndView("redirect:/backend/userlist.html");
		}
	}
	
	@RequestMapping(value = "/backend/upload.html", produces = {"text/html;charset=UTF-8"})  
	@ResponseBody
    public Object upload(@RequestParam(value = "a_fileInputID", required = false) MultipartFile cardFile, 
    		             @RequestParam(value = "a_fileInputBank", required = false) MultipartFile bankFile, 
    		             @RequestParam(value = "m_fileInputID", required = false) MultipartFile mCardFile, 
    		             @RequestParam(value = "m_fileInputBank", required = false) MultipartFile mBankFile, 
    		             @RequestParam(value = "loginCode", required = false) String loginCode, 
    					 HttpServletRequest request,HttpSession session) {  
  
        logger.debug("开始....");
        //根据服务器的操作系统，自动获取物理路径，自动适应各个操作系统的路径
        String path = request.getSession().getServletContext().getRealPath("statics"+File.separator+"uploadfiles");  
        logger.debug("hanlu path======== " + path);
        List<DataDictionary> list = null;
        DataDictionary dataDictionary = new DataDictionary();
        dataDictionary.setTypeCode("PERSONALFILE_SIZE");
        try {
			list = dataDictionaryService.getDataDictionaries(dataDictionary);
		} catch (Exception e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
        int filesize = 50000;
        if(null != list){
        	 if(list.size() == 1){
             	filesize = Integer.valueOf(list.get(0).getValueName());
             }
        }
       
        if(cardFile != null){
        	String oldFileName = cardFile.getOriginalFilename();//获取原文件名
            String prefix=FilenameUtils.getExtension(oldFileName);//取文件后缀
            logger.debug("hanlu bankFile prefix======== " + prefix);
            if(cardFile.getSize() >  filesize){//上传大小不得超过 50k
            	return "1";

            }else if(prefix.equalsIgnoreCase("jpg") || prefix.equalsIgnoreCase("png") 
            		|| prefix.equalsIgnoreCase("jpeg") || prefix.equalsIgnoreCase("pneg")){
            	//给文件重命名：系统毫秒数+100W以内的随机数
            	String fileName = System.currentTimeMillis()+RandomUtils.nextInt(1000000)+"_IDcard.jpg";  
                logger.debug("hanlu new fileName======== " + cardFile.getName());
                File targetFile = new File(path, fileName);  
                if(!targetFile.exists()){  
                    targetFile.mkdirs();  
                }  
                //保存  
                try {  
                	cardFile.transferTo(targetFile);  
                } catch (Exception e) {  
                    e.printStackTrace();  
                }  
                String url = request.getContextPath()+"/statics/uploadfiles/"+fileName;
                return url;  
            }else{
            	return "2";
            }
        }
        if(bankFile != null){
        	String oldFileName = bankFile.getOriginalFilename();
            logger.debug("hanlu bankFile oldFileName======== " + oldFileName);
            String prefix=FilenameUtils.getExtension(oldFileName);     
            if(bankFile.getSize() >  filesize){//上传大小不得超过 50k
            	return "1";
            }else if(prefix.equalsIgnoreCase("jpg") || prefix.equalsIgnoreCase("png") 
            		|| prefix.equalsIgnoreCase("jpeg") || prefix.equalsIgnoreCase("pneg")){
            	String fileName = System.currentTimeMillis()+RandomUtils.nextInt(1000000)+"_bank.jpg";  
                logger.debug("hanlu bankFile new fileName======== " + bankFile.getName());
                File targetFile = new File(path, fileName);  
                if(!targetFile.exists()){  
                    targetFile.mkdirs();  
                }  
                //保存  
                try {  
                	bankFile.transferTo(targetFile);  
                } catch (Exception e) {  
                    e.printStackTrace();  
                }  
                String url = request.getContextPath()+"/statics/uploadfiles/"+fileName;
                return url;  
            }else{//上传图片格式不正确
            	return "2";
            }
        }
        if(mCardFile != null){
        	String oldFileName = mCardFile.getOriginalFilename();
            String prefix=FilenameUtils.getExtension(oldFileName);     
            if(mCardFile.getSize() >  filesize){//上传大小不得超过 50k
            	return "1";
            }else if(prefix.equalsIgnoreCase("jpg") || prefix.equalsIgnoreCase("png") 
            		|| prefix.equalsIgnoreCase("jpeg") || prefix.equalsIgnoreCase("pneg")){//上传图片格式不正确
            	String fileName = System.currentTimeMillis()+RandomUtils.nextInt(1000000)+"_IDcard.jpg";  
                logger.debug("hanlu new fileName======== " + mCardFile.getName());
                File targetFile = new File(path, fileName);  
                if(!targetFile.exists()){  
                    targetFile.mkdirs();  
                }  
                //保存  
                try {  
                	mCardFile.transferTo(targetFile);  
                } catch (Exception e) {  
                    e.printStackTrace();  
                }  
                String url = request.getContextPath()+"/statics/uploadfiles/"+fileName;
                return url;  
            }else{
            	return "2";
            }
        }
        if(mBankFile != null){
        	String oldFileName = mBankFile.getOriginalFilename();
            logger.debug("hanlu bankFile oldFileName======== " + oldFileName);
            String prefix=FilenameUtils.getExtension(oldFileName);     
            if(mBankFile.getSize() >  filesize){//上传大小不得超过 50k
            	return "1";
            }else if(prefix.equalsIgnoreCase("jpg") || prefix.equalsIgnoreCase("png") 
            		|| prefix.equalsIgnoreCase("jpeg") || prefix.equalsIgnoreCase("pneg")){//上传图片格式不正确
            	String fileName = System.currentTimeMillis()+RandomUtils.nextInt(1000000)+"_bank.jpg";  
                logger.debug("hanlu bankFile new fileName======== " + mBankFile.getName());
                File targetFile = new File(path, fileName);  
                if(!targetFile.exists()){  
                    targetFile.mkdirs();  
                }  
                //保存  
                try {  
                	mBankFile.transferTo(targetFile);  
                } catch (Exception e) {  
                    e.printStackTrace();  
                }  
                String url = request.getContextPath()+"/statics/uploadfiles/"+fileName;
                return url;  
            }else{
            	return "2";
            }
        }
        return null;
    }  
	
	@RequestMapping(value = "/backend/delpic.html", produces = {"text/html;charset=UTF-8"})
	@ResponseBody
	public String delPic(@RequestParam(value="picpath",required=false) String picpath,
						 @RequestParam(value="id",required=false) String id,
						HttpServletRequest request,HttpSession session){
		String result= "failed" ;
		if(picpath == null || picpath.equals("")){
			result = "success"; 
		}else{
			//picpath：传过来的网络路径，需要解析成物理路径
			String[] paths = picpath.split("/");
			String path = request.getSession().getServletContext().getRealPath(paths[1]+File.separator+paths[2]+File.separator+paths[3]);  
			File file = new File(path);
		    
		    if(file.exists())
		     if(file.delete()){
		    	 if(id.equals("0")){//添加用户时，删除上传的图片
		    		 result = "success";
		    	 }else{//修改用户时，删除上传的图片
		    		 User _user = new User();
			    	 _user.setId(Integer.valueOf(id));
			    	 if(picpath.indexOf("_IDcard.jpg") != -1)
			    		 _user.setIdCardPicPath(picpath);
			    	 else if(picpath.indexOf("_bank.jpg") != -1)
			    		 _user.setBankPicPath(picpath);
			    	 try {
						if(userService.delUserPic(_user) > 0){
							logger.debug("hanlu modify----userService.delUserPic======== " );
							result = "success";
						}
					} catch (Exception e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
						return result;
					}
		    	 }
		    }
		}
		return result;
	}

	@RequestMapping(value = "/backend/deluser.html", produces = {"text/html;charset=UTF-8"})
	@ResponseBody
	public String delUser(@RequestParam(value="delId",required=false) String delId,
						  @RequestParam(value="delIdCardPicPath",required=false) String delIdCardPicPath,			  
						  @RequestParam(value="delBankPicPath",required=false) String delBankPicPath,			  
						  @RequestParam(value="delUserType",required=false) String delUserType,			  
						  HttpServletRequest request,HttpSession session){
		
		String result= "false" ;
		User delUser = new User();
		delUser.setId(Integer.valueOf(delId));
		try {
			//若被删除的用户为：普通消费会员、VIP会员、加盟店  则不可被删除
			if(delUserType.equals("2") || delUserType.equals("3") || delUserType.equals("4")){
				result = "noallow";
			}else{
				if(this.delPic(delIdCardPicPath,delId,request,session).equals("success") && this.delPic(delBankPicPath,delId,request,session).equals("success")){
					if(userService.deleteUser(delUser) > 0)
						result = "success";
				}
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return result;
	}
	
	@RequestMapping(value = "/backend/logincodeisexit.html", produces = {"text/html;charset=UTF-8"})
	@ResponseBody
	public String loginCodeIsExit(@RequestParam(value="loginCode",required=false) String loginCode,
								  @RequestParam(value="id",required=false) String id){
		logger.debug("hanlu loginCodeIsExit loginCode===================== "+loginCode);
		logger.debug("hanlu loginCodeIsExit id===================== "+id);
		String result = "failed";
		User _user = new User();
		_user.setLoginCode(loginCode);
		if(!id.equals("-1"))
			_user.setId(Integer.valueOf(id));
		try {
			if(userService.loginCodeIsExit(_user) == 0)
				result = "only";
			else 
				result = "repeat";
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return result;
		}
		return result;
	}
	@RequestMapping(value = "/backend/getuser.html", produces = {"text/html;charset=UTF-8"})
	@ResponseBody
	public Object getUser(@RequestParam(value="id",required=false) String id){
		String cjson = "";
		if(null == id || "".equals(id)){
			return "nodata";
		}else{
			try {
				User user = new User();
				user.setId(Integer.valueOf(id));
				user = userService.getUserById(user);
				//user对象里有日期，所有有日期的属性，都要按照此日期格式进行json转换（对象转json）
				JsonConfig jsonConfig = new JsonConfig();
				jsonConfig.registerJsonValueProcessor(Date.class, new JsonDateValueProcessor());
				JSONObject jo = JSONObject.fromObject(user,jsonConfig);
				cjson = jo.toString();
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				return "failed";
			}
				return cjson;
		}
	}
	
	@RequestMapping(value = "/backend/loadUserTypeList.html", produces = {"text/html;charset=UTF-8"})
	@ResponseBody
	public Object loadUserTypeList(@RequestParam(value="s_roleId",required=false) String s_roleId){
		String cjson = "";
		try {
			DataDictionary dataDictionary = new DataDictionary();
			dataDictionary.setTypeCode("USER_TYPE");
			List<DataDictionary> userTypeList = dataDictionaryService.getDataDictionaries(dataDictionary);
			JSONArray jo = JSONArray.fromObject(userTypeList);
			cjson = jo.toString();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
			return cjson;
	}
	
	@RequestMapping(value = "/backend/modifyuser.html",method=RequestMethod.POST)
	public ModelAndView modifyUser(HttpSession session,@ModelAttribute("modifyUser") User modifyUser){
		if(session.getAttribute(Constants.SESSION_BASE_MODEL) == null){
			return new ModelAndView("redirect:/");
		}else{
			try {
				modifyUser.setLastUpdateTime(new Date());
				userService.modifyUser(modifyUser);
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			return new ModelAndView("redirect:/backend/userlist.html");
		}
	}
}
