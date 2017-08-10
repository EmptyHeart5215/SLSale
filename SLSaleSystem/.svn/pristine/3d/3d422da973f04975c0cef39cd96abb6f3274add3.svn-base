package org.slsale.common;
/**
 * mybatis 防止sql注入工具类
 * @author hanlu
 *
 */
public class SQLTools {
	/**
	 * mybaits 模糊查询防止sql注入（字符替换）
	 * @param keyword
	 * @return
	 */
	public static String transfer(String keyword){
		if(keyword.contains("%") || keyword.contains("_")){
			keyword = keyword.replaceAll("\\\\", "\\\\\\\\")
							.replaceAll("\\%", "\\\\%")
							.replaceAll("\\_", "\\\\_");
		}
		return keyword;
	}
}
